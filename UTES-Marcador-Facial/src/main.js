import { API_POR_DEFECTO, guardarConfig, leerConfig } from './config.js';
import { comoDispositivo, iniciarSesion } from './api.js';
import { aBase64, cargarModelos, distancia, encenderCamara, leerRostro, promedio } from './rostro.js';

// Kiosco de marcacion facial para UTES-RRHH. Tres pantallas:
//  - configurar: a que API y con que dispositivo se conecta (una vez por equipo);
//  - marcar: la camara busca un rostro, lo envia a UTES y muestra la entrada o salida registrada;
//  - registrar: RRHH ingresa con su usuario de UTES y guarda el rostro de un trabajador (con consentimiento vigente).

const $ = (id) => document.getElementById(id);
const MS_ENTRE_LECTURAS = 250;
const LECTURAS_PARA_MARCAR = 3; // cuadros seguidos con el mismo rostro antes de enviar (evita marcas por un vistazo)
const PROPORCION_MINIMA = 0.2; // ancho del rostro / ancho del video: mas lejos no se marca
const MS_RESULTADO = 4000;
const MUESTRAS_DE_REGISTRO = 5;

let config = leerConfig();
let dispositivo = null;
let desfaseReloj = 0; // hora del servidor - hora local (el reloj del kiosco muestra la del servidor)
let modelos = null;
let apagarCamara = null;
let pantalla = null;

// ------------------------------------------------------------------------------------------- navegacion y reloj

function mostrar(nombre) {
  pantalla = nombre;
  for (const id of ['configurar', 'marcar', 'registrar']) $(`pantalla-${id}`).hidden = id !== nombre;
  apagarCamara?.();
  apagarCamara = null;
  if (nombre === 'marcar') iniciarMarcacion();
  if (nombre === 'registrar') iniciarRegistro();
  if (nombre === 'configurar') abrirConfiguracion();
}

function tic() {
  const ahora = new Date(Date.now() + desfaseReloj);
  $('hora').textContent = ahora.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Lima' });
  $('fecha').textContent = ahora.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Lima' });
}
setInterval(tic, 1000);
tic();

async function conectar() {
  const estado = await comoDispositivo(config).estado();
  dispositivo = estado.dispositivo;
  desfaseReloj = new Date(estado.hora_servidor).getTime() - Date.now();
  $('lugar').textContent = `${dispositivo.nombre}${dispositivo.eess ? ` · ${dispositivo.eess}` : ''}`;
}

const prepararModelos = () => (modelos ??= cargarModelos());

// ------------------------------------------------------------------------------------------- configurar

function abrirConfiguracion() {
  $('cfg-api').value = config?.api ?? API_POR_DEFECTO;
  $('cfg-dispositivo').value = config?.dispositivo ?? '';
  $('cfg-clave').value = '';
  $('cfg-cancelar').hidden = !config;
  $('cfg-error').hidden = true;
}

$('form-config').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const anterior = config;
  config = guardarConfig({ api: $('cfg-api').value, dispositivo: $('cfg-dispositivo').value, clave: $('cfg-clave').value });
  try {
    await conectar();
    mostrar('marcar');
  } catch (error) {
    config = anterior;
    if (anterior) guardarConfig(anterior);
    $('cfg-error').textContent = error.message;
    $('cfg-error').hidden = false;
  }
});
$('cfg-cancelar').addEventListener('click', () => mostrar('marcar'));
$('ir-configurar').addEventListener('click', () => mostrar('configurar'));
$('ir-registrar').addEventListener('click', () => mostrar('registrar'));
$('reg-salir').addEventListener('click', () => mostrar('marcar'));

// ------------------------------------------------------------------------------------------- marcar

function estado(texto, tono = '') {
  $('estado').textContent = texto;
  $('estado').dataset.tono = tono;
}

function verResultado({ tono, icono, titulo, nombre = '', detalle = '' }) {
  const caja = $('resultado');
  caja.dataset.tono = tono;
  $('res-icono').textContent = icono;
  $('res-titulo').textContent = titulo;
  $('res-nombre').textContent = nombre;
  $('res-detalle').textContent = detalle;
  caja.hidden = false;
}

function dibujarCaja(video, caja, color) {
  const lienzo = $('lienzo');
  lienzo.width = video.videoWidth;
  lienzo.height = video.videoHeight;
  const ctx = lienzo.getContext('2d');
  ctx.clearRect(0, 0, lienzo.width, lienzo.height);
  if (!caja) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.strokeRect(caja.x, caja.y, caja.width, caja.height);
}

async function iniciarMarcacion() {
  const video = $('video');
  $('resultado').hidden = true;
  try {
    estado('Cargando reconocimiento facial…');
    await prepararModelos();
    apagarCamara = await encenderCamara(video);
  } catch (error) {
    estado(error.name === 'NotAllowedError' ? 'Permite el uso de la cámara en el navegador para poder marcar.' : error.message, 'error');
    return;
  }
  estado('Acércate a la cámara para marcar.');

  const api = comoDispositivo(config);
  let lecturas = [];
  let pausaHasta = 0;

  const ciclo = async () => {
    if (pantalla !== 'marcar' || !apagarCamara) return;
    try {
      if (Date.now() < pausaHasta) return;
      if (Date.now() - pausaHasta > MS_RESULTADO) $('resultado').hidden = true;
      const rostro = await leerRostro(video);
      if (!rostro) {
        lecturas = [];
        dibujarCaja(video, null);
        estado('Acércate a la cámara para marcar.');
        return;
      }
      if (rostro.proporcion < PROPORCION_MINIMA) {
        lecturas = [];
        dibujarCaja(video, rostro.caja, '#f59e0b');
        estado('Acércate un poco más.', 'aviso');
        return;
      }
      // Debe ser el mismo rostro en cuadros seguidos (si cambia, se empieza de nuevo).
      if (lecturas.length && distancia(lecturas[lecturas.length - 1], rostro.descriptor) > 0.35) lecturas = [];
      lecturas.push(rostro.descriptor);
      dibujarCaja(video, rostro.caja, '#14b8a6');
      estado('Quédate quieto…');
      if (lecturas.length < LECTURAS_PARA_MARCAR) return;

      const descriptor = Array.from(promedio(lecturas));
      lecturas = [];
      estado('Verificando…');
      try {
        const r = await api.marcar(descriptor);
        verResultado(
          r.resultado === 'REGISTRADA'
            ? { tono: 'ok', icono: '✓', titulo: r.tipo === 'ENTRADA' ? `Entrada · ${r.hora}` : `Salida · ${r.hora}`, nombre: r.trabajador, detalle: r.mensaje }
            : { tono: 'info', icono: 'i', titulo: 'Ya estabas marcado', nombre: r.trabajador, detalle: r.mensaje },
        );
      } catch (error) {
        verResultado({ tono: 'error', icono: '!', titulo: error.estado === 422 ? 'No se registró' : 'Sin conexión', detalle: error.message });
      }
      pausaHasta = Date.now() + MS_RESULTADO;
      dibujarCaja(video, null);
      estado('Siguiente persona: acércate a la cámara.');
    } finally {
      if (pantalla === 'marcar' && apagarCamara) setTimeout(ciclo, MS_ENTRE_LECTURAS);
    }
  };
  ciclo();
}

// ------------------------------------------------------------------------------------------- registrar rostro

let sesion = null;
let elegido = null;

function errorDeRegistro(texto) {
  $('reg-error').textContent = texto ?? '';
  $('reg-error').hidden = !texto;
}

function pasoDeRegistro(paso) {
  $('reg-login').hidden = paso !== 'login';
  $('reg-buscar').hidden = paso !== 'buscar';
  $('reg-captura').hidden = paso !== 'captura';
  errorDeRegistro(null);
}

function iniciarRegistro() {
  if (!sesion) {
    $('reg-password').value = '';
    pasoDeRegistro('login');
    return;
  }
  pasoDeRegistro('buscar');
}

// Al salir de la pantalla de registro se cierra la sesion de RRHH: el kiosco no queda con un usuario abierto.
const salirDeRegistro = () => {
  sesion?.cerrar();
  sesion = null;
  elegido = null;
};
$('reg-salir').addEventListener('click', salirDeRegistro, { capture: true });

$('reg-login').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    sesion = await iniciarSesion(config.api, $('reg-usuario').value.trim(), $('reg-password').value);
    $('reg-sesion').textContent = `Sesión de ${sesion.nombre}. Busca al trabajador cuyo rostro vas a registrar.`;
    $('reg-lista').innerHTML = '';
    pasoDeRegistro('buscar');
  } catch (error) {
    errorDeRegistro(error.message);
  }
});

$('form-buscar').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  errorDeRegistro(null);
  try {
    const trabajadores = await sesion.buscarTrabajador($('reg-texto').value.trim());
    const lista = $('reg-lista');
    lista.innerHTML = '';
    if (!trabajadores.length) lista.innerHTML = '<li class="vacio">No se encontró ningún trabajador activo.</li>';
    for (const t of trabajadores) {
      const li = document.createElement('li');
      const boton = document.createElement('button');
      boton.className = 'fila';
      const donde = t.vinculos?.map((v) => v.eess).filter(Boolean).join(' · ') || 'sin vínculo vigente';
      boton.innerHTML = `<strong></strong><small></small>`;
      boton.querySelector('strong').textContent = t.nombre_completo;
      boton.querySelector('small').textContent = `DNI ${t.numero_documento} · ${donde}`;
      boton.addEventListener('click', () => elegir(t));
      li.append(boton);
      lista.append(li);
    }
  } catch (error) {
    errorDeRegistro(error.estado === 401 ? 'La sesión venció: vuelve a ingresar.' : error.message);
  }
});

async function elegir(trabajador) {
  elegido = trabajador;
  pasoDeRegistro('captura');
  $('reg-trabajador').textContent = `${trabajador.nombre_completo} · DNI ${trabajador.numero_documento}`;
  $('reg-barra').style.width = '0%';
  $('reg-capturar').disabled = true;
  const aviso = $('reg-aviso');
  aviso.hidden = true;
  try {
    const [consentimiento, rostros] = await Promise.all([sesion.consentimiento(trabajador.id), sesion.rostrosRegistrados(trabajador.id)]);
    if (!consentimiento?.aceptado) {
      aviso.textContent =
        'No tiene un consentimiento biométrico aceptado. Regístralo primero en UTES (Configuración › Biometría › Consentimientos): sin él la ley no permite guardar su rostro.';
      aviso.hidden = false;
      return;
    }
    if (rostros.length) {
      aviso.textContent = `Ya tiene ${rostros.length === 1 ? 'un rostro registrado' : `${rostros.length} rostros registrados`}: el nuevo se suma (mejora el reconocimiento con otra luz o aspecto).`;
      aviso.hidden = false;
    }
    await prepararModelos();
    apagarCamara?.();
    apagarCamara = await encenderCamara($('reg-video'));
    $('reg-capturar').disabled = false;
  } catch (error) {
    errorDeRegistro(error.message);
  }
}

$('reg-otro').addEventListener('click', () => {
  apagarCamara?.();
  apagarCamara = null;
  pasoDeRegistro('buscar');
});

$('reg-capturar').addEventListener('click', async () => {
  const boton = $('reg-capturar');
  boton.disabled = true;
  errorDeRegistro(null);
  const muestras = [];
  const limite = Date.now() + 30000;
  while (muestras.length < MUESTRAS_DE_REGISTRO && Date.now() < limite) {
    const rostro = await leerRostro($('reg-video'));
    if (rostro && rostro.proporcion >= PROPORCION_MINIMA && rostro.puntaje >= 0.85) {
      muestras.push(rostro.descriptor);
      $('reg-barra').style.width = `${(muestras.length / MUESTRAS_DE_REGISTRO) * 100}%`;
      $('reg-estado').textContent = `Muestra ${muestras.length} de ${MUESTRAS_DE_REGISTRO}…`;
    } else {
      $('reg-estado').textContent = rostro ? 'Acércate un poco más y mira de frente.' : 'No veo un rostro: mira a la cámara.';
    }
    await new Promise((r) => setTimeout(r, 350));
  }
  if (muestras.length < MUESTRAS_DE_REGISTRO) {
    errorDeRegistro('No se pudo tomar el rostro con claridad. Mejora la luz y vuelve a intentarlo.');
    boton.disabled = false;
    return;
  }
  const descriptor = promedio(muestras);
  if (muestras.some((m) => distancia(m, descriptor) > 0.4)) {
    errorDeRegistro('Las muestras no coinciden entre sí (¿se movió o cambió de persona?). Vuelve a capturar.');
    $('reg-barra').style.width = '0%';
    boton.disabled = false;
    return;
  }
  try {
    await sesion.guardarRostro(elegido.id, aBase64(descriptor));
    $('reg-estado').textContent = `Rostro de ${elegido.nombre_completo} registrado. Ya puede marcar en este kiosco.`;
  } catch (error) {
    errorDeRegistro(error.message);
    boton.disabled = false;
  }
});

// ------------------------------------------------------------------------------------------- inicio

if (!config) {
  mostrar('configurar');
} else {
  conectar()
    .then(() => mostrar('marcar'))
    .catch((error) => {
      mostrar('configurar');
      $('cfg-error').textContent = error.message;
      $('cfg-error').hidden = false;
    });
}
