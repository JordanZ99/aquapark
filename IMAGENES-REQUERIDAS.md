# 📸 Imágenes requeridas — Splash Parque Acuático

Carpeta destino: **Astro/public/**  
Formato recomendado: **JPG** (máx. 300–500 KB cada uno)

---

## Imágenes principales

| # | Archivo | Sección | Dimensiones | Descripción |
|---|---------|---------|-------------|-------------|
| 1 | `hero-bg.jpg` | Hero | 1920 × 1080 | Foto aérea del parque: tobogán azul, albercas, palapas |
| 2 | `park-overview.jpg` | Nosotros | 800 × 600 | Vista general del parque desde tierra |
| 3 | `aquabar-bg.jpg` | AquaBar | 1920 × 1080 | La barra/balcones sobre el agua, ambiente tropical |
| 4 | `food-bg.jpg` | Alimentos | 800 × 600 | Platillos yucatecos, BBQ, cocteles en la mesa |
| 5 | `souvenirs.jpg` | Tienda Splash | 800 × 600 | Productos de la tienda: trajes, flotadores, gorras |

## Atracciones (tarjetas del carrusel)

| # | Archivo | Atracción | Dimensiones | Descripción |
|---|---------|-----------|-------------|-------------|
| 6 | `attraction-1.jpg` | La Torre Azul | 800 × 500 | Tobogán alto azul, caída libre |
| 7 | `attraction-2.jpg` | El Huracán | 800 × 500 | Tobogán de tubo cerrado |
| 8 | `attraction-3.jpg` | Río Loco | 800 × 500 | Alberca de oleaje artificial con gente |
| 9 | `attraction-4.jpg` | Zona Kids | 800 × 500 | Chapoteadero infantil con resbaladillas |
| 10 | `attraction-5.jpg` | La Laguna | 800 × 500 | Alberca principal con camastros y palapas |

## Galería (grid masonry)

| # | Archivo | Sugerencia | Dimensiones |
|---|---------|------------|-------------|
| 11 | `gallery-1.jpg` | Alberca principal vista amplia | 600 × 400 |
| 12 | `gallery-2.jpg` | Torre Azul vista desde abajo | 600 × 500 |
| 13 | `gallery-3.jpg` | Plato de comida yucateca | 600 × 350 |
| 14 | `gallery-4.jpg` | Zona kids con niños jugando | 600 × 450 |
| 15 | `gallery-5.jpg` | AquaBar al atardecer | 600 × 420 |
| 16 | `gallery-6.jpg` | Tobogán Huracán en acción | 600 × 520 |
| 17 | `gallery-7.jpg` | Vista aérea/drone del parque | 600 × 360 |
| 18 | `gallery-8.jpg` | Coctel o michelada Splash | 600 × 440 |

---

## Notas

- **No se necesitan videos** — todo es imagen estática
- **No se necesitan fuentes extra** — se cargan desde Google Fonts CDN
- **No se necesitan íconos** — todos son SVG inline en el código
- Mientras no agregues las imágenes, el sitio funciona correctamente con **gradientes de fallback** de colores
- Las imágenes de galería pueden tener **alturas variables** (el grid masonry lo maneja automáticamente)

## Cómo agregarlas

1. Copia los archivos JPG a la carpeta `Astro/public/` con los nombres exactos de la tabla
2. Corre `npm run build` o `npm run dev` dentro de la carpeta `Astro`
3. Las imágenes aparecerán automáticamente en el sitio
