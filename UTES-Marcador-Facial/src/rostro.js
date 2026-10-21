import * as faceapi from '@vladmandic/face-api';

// Deteccion y descriptor del rostro con face-api (TensorFlow.js en el navegador). El descriptor son 128 numeros que
// resumen la cara: se envian a UTES, que es quien decide a quien corresponde. Nunca se guardan ni se envian fotos.

const OPCIONES = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.6, maxResults: 1 });

export async function cargarModelos() {
  await faceapi.tf.ready();
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  ]);
  // Calentamiento: la primera deteccion prepara la GPU y tarda varios segundos; se hace aqui, con un cuadro vacio,
  // para que la primera persona que marque no espere.
  const vacio = document.createElement('canvas');
  vacio.width = 640;
  vacio.height = 480;
  await faceapi.detectSingleFace(vacio, OPCIONES);
  await faceapi.detectFaceLandmarks(vacio);
  await faceapi.computeFaceDescriptor(vacio);
}

/**
 * El rostro mas visible del cuadro de video, o null.
 * @returns {Promise<{descriptor: Float32Array, caja: {x:number,y:number,width:number,height:number}, proporcion: number, puntaje: number} | null>}
 */
export async function leerRostro(video) {
  const deteccion = await faceapi.detectSingleFace(video, OPCIONES).withFaceLandmarks().withFaceDescriptor();
  if (!deteccion) return null;
  const caja = deteccion.detection.box;
  return { descriptor: deteccion.descriptor, caja, proporcion: caja.width / video.videoWidth, puntaje: deteccion.detection.score };
}

export function promedio(descriptores) {
  const suma = new Float32Array(descriptores[0].length);
  for (const d of descriptores) d.forEach((v, i) => (suma[i] += v));
  return suma.map((v) => v / descriptores.length);
}

export const distancia = (a, b) => faceapi.euclideanDistance(a, b);

/** Float32Array -> base64 (bytes float32 little-endian), el formato de PlantillaBiometricaReferencia en UTES. */
export function aBase64(descriptor) {
  const bytes = new Uint8Array(new Float32Array(descriptor).buffer);
  let binario = '';
  bytes.forEach((b) => (binario += String.fromCharCode(b)));
  return btoa(binario);
}

/** Enciende la camara del equipo (la primera disponible, de frente) dentro del <video>. */
export async function encenderCamara(video) {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('Este navegador no permite usar la cámara (ábrelo con http://localhost o con https).');
  }
  const flujo = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
  video.srcObject = flujo;
  await video.play();
  return () => flujo.getTracks().forEach((t) => t.stop());
}
