# Imágenes institucionales

| Archivo | Ruta | Se usa en |
|---------|------|-----------|
| `building-bg.png` | `public/assets/images/branding/building-bg.png` | Fondo difuminado de la esquina del área de contenido (`BrandBackdrop`) y del login (si no existe `login-bg.jpg`). |
| `sidebar-illustration.png` | `public/assets/images/branding/sidebar-illustration.png` | Parte inferior del sidebar y silueta inferior del login. PNG con fondo transparente. |
| `login-bg.jpg` (opcional) | `public/assets/images/branding/login-bg.jpg` | Foto de fondo del login (1600 × 900 px, horizontal). Si no existe se usa `building-bg.png`. |

El logo institucional (login, ícono de la pestaña y PDF de calendarios) es
`public/assets/images/documents/logo-gerencia-salud.jpg`. Para los PDF el backend usa una copia en
`UTES-RRHH-Backend/resources/images/logo-gerencia-salud.jpg`: si cambias el logo, reemplaza ambos archivos.

La opacidad, el desenfoque, las máscaras y los degradados se aplican por CSS; no hace falta editar las imágenes.
