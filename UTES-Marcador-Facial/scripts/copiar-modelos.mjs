// Copia a public/models los tres modelos de face-api que usa el kiosco (detector, puntos del rostro y descriptor).
// Se ejecuta solo antes de `npm run dev` y `npm run build`: los modelos viajan con la app y no se descargan de internet.
import { cpSync, existsSync, mkdirSync } from 'node:fs';

const ORIGEN = 'node_modules/@vladmandic/face-api/model';
const DESTINO = 'public/models';
const MODELOS = ['ssd_mobilenetv1_model', 'face_landmark_68_model', 'face_recognition_model'];

mkdirSync(DESTINO, { recursive: true });
for (const modelo of MODELOS) {
  for (const archivo of [`${modelo}-weights_manifest.json`, `${modelo}.bin`]) {
    if (!existsSync(`${DESTINO}/${archivo}`)) cpSync(`${ORIGEN}/${archivo}`, `${DESTINO}/${archivo}`);
  }
}
console.log('Modelos de reconocimiento facial listos en public/models');
