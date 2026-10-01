# Imágenes institucionales

Coloca aquí las dos imágenes. Mientras no existan, el sistema se ve correctamente
(se muestran solo las manchas/círculos de color y el sidebar sin ilustración).

| Archivo                   | Ruta                                                      | Tamaño recomendado | Se usa en |
|---------------------------|-----------------------------------------------------------|--------------------|-----------|
| `building-bg.png`         | `public/assets/images/branding/building-bg.png`           | 1600 × 900 px (PNG/JPG, foto del edificio/hospital, horizontal) | Fondo difuminado de la esquina superior derecha del área de contenido (`.brand-backdrop` en `src/index.css`, componente `BrandBackdrop`). CSS la desatura, aclara, desenfoca y aplica una máscara. |
| `sidebar-illustration.png`| `public/assets/images/branding/sidebar-illustration.png`  | 560 × 360 px (PNG con fondo transparente, ilustración institucional en tonos claros) | Parte inferior del sidebar (`src/components/Sidebar.jsx`). Se funde con el azul marino con una máscara. |

No hace falta editar la imagen: la opacidad, el desenfoque y el degradado se aplican por CSS.
