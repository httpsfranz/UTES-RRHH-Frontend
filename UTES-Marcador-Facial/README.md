# UTES · Marcador facial

Kiosco de marcación por reconocimiento facial para UTES-RRHH. Corre en el navegador de una PC con cámara, en la puerta del establecimiento.

## Cómo funciona

1. La cámara detecta el rostro y calcula su descriptor: 128 números que resumen la cara (face-api / TensorFlow.js, dentro del navegador).
2. El descriptor se envía a UTES (`POST /api/marcador-facial/marcar`). El backend lo compara con los rostros registrados del personal del establecimiento del dispositivo y, si coincide, registra la marca. La entrada o la salida se deduce sola.
3. El kiosco muestra el resultado: entrada o salida con la hora del servidor, "ya estabas marcado" o "no te reconocí".

**Privacidad:**
- No se guardan ni se envían fotos, solo el descriptor.
- El rostro de un trabajador solo se guarda si tiene un consentimiento biométrico aceptado en UTES.
- Cada intento queda registrado en *Logs de integración* (`MARCADOR_FACIAL`).

## Puesta en marcha

```bash
npm install
npm run dev        # http://localhost:5180  (o: npm run build  y servir dist/)
```

En el backend de UTES:

```bash
php artisan biometria:clave-dispositivo              # lista los dispositivos faciales activos y su clave
php artisan biometria:clave-dispositivo DISP-LE-02   # la clave de uno
```

- **Requisito de CORS:** el origen del kiosco debe estar en `FRONTEND_URL` del `.env` del backend. Ya incluye `http://localhost:5180`.
- **Permiso de cámara:** el navegador solo permite la cámara en `http://localhost` o en `https`.

La primera vez, el kiosco pide tres datos:
- la dirección de la API,
- el código del dispositivo, que debe estar registrado en UTES como **activo** y de tipo **Facial**,
- su clave.

Para revocar el acceso de un kiosco, desactiva el dispositivo en UTES.

## Registrar el rostro de un trabajador

1. Antes, en UTES, se registra su **consentimiento biométrico** en Configuración › Biometría.
2. En el kiosco se elige **Registrar rostro (RRHH)** y se ingresa con un usuario de UTES con permiso de biometría.
3. Se busca al trabajador por DNI y se pulsa **Capturar rostro**: el kiosco toma 5 muestras y guarda su promedio como plantilla `ROSTRO`.
4. Al volver a la pantalla de marcar se cierra la sesión del usuario de RRHH.

## Ajustes en el backend (`.env`)

| Variable | Por defecto | Qué hace |
|---|---|---|
| `BIOMETRIA_UMBRAL_FACIAL` | `0.5` | Distancia máxima entre rostros para aceptarlos como la misma persona. Si se baja, es más estricto. |
| `BIOMETRIA_MINUTOS_ENTRE_MARCAS` | `10` | Durante este tiempo, la misma persona frente a la cámara no genera otra marca. |

## Límites conocidos

No hay prueba de vida: una foto impresa de buena calidad podría marcar. Para mitigarlo:
- ubicar el kiosco a la vista del personal de portería,
- revisar los *Logs de integración*.
