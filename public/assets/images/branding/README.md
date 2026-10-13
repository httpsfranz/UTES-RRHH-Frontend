# Imágenes institucionales

Coloca aquí las dos imágenes. Mientras no existan, el sistema se ve correctamente
(se muestran solo las manchas/círculos de color y el sidebar sin ilustración).

| Archivo                   | Ruta                                                      | Tamaño recomendado | Se usa en |
|---------------------------|-----------------------------------------------------------|--------------------|-----------|
| `building-bg.png`         | `public/assets/images/branding/building-bg.png`           | 1600 × 900 px (PNG/JPG, foto del edificio/hospital, horizontal) | Fondo difuminado de la esquina superior derecha del área de contenido (`.brand-backdrop` en `src/index.css`, componente `BrandBackdrop`). CSS la desatura, aclara, desenfoca y aplica una máscara. |
| `sidebar-illustration.png`| `public/assets/images/branding/sidebar-illustration.png`  | 560 × 360 px (PNG con fondo transparente, ilustración institucional en tonos claros) | Parte inferior del sidebar (`src/components/Sidebar.jsx`). Se funde con el azul marino con una máscara. |

No hace falta editar la imagen: la opacidad, el desenfoque y el degradado se aplican por CSS.

## Pantalla de acceso (login)

| Archivo | Ruta | Tamaño recomendado | Se usa en |
|---------|------|--------------------|-----------|
| `login-bg.jpg` | `public/assets/images/branding/login-bg.jpg` | 1600 × 1200 px (foto del hospital o del edificio, horizontal) | Fondo difuminado del panel izquierdo del login. Si no existe se usa `building-bg.png`. |
| `logo.png` | `public/assets/images/branding/logo.png` | 512 × 512 px (PNG con fondo transparente, preferible en tonos claros o blanco) | Logo dentro del círculo de cristal del login. Si no existe se muestra el icono de la Red. |

El difuminado, las manchas de color y el degradado se aplican por CSS (`src/components/auth/LoginLayout.jsx`); no hace falta editar las imágenes.
