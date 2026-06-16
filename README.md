# Messox — Landing

Landing de una sola página construida con HTML, CSS ([Tailwind CSS](https://tailwindcss.com)) y JavaScript puro, empaquetada con [Vite](https://vite.dev). El fondo es un shader WebGL implementado directamente sobre la API de WebGL (sin three.js) para mantener el bundle ligero.

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm run build    # build de producción en dist/
npm run preview  # sirve el build de producción
```

## Despliegue (GitHub Pages)

El workflow `.github/workflows/deploy.yml` construye y publica en cada push a `main`.

1. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Haz push a `main`.

`vite.config.js` usa `base: "./"` (rutas relativas), por lo que funciona tanto en
una subruta (`usuario.github.io/messox-web/`) como en un dominio propio.

### Dominio propio (messox.com)

Para servir desde `messox.com`, añade un archivo `public/CNAME` con el contenido
`messox.com` y configura el dominio en **Settings → Pages**.

## Logo

El logotipo está en `public/logo.png` (monocromo). Se renderiza en blanco mediante
un filtro CSS para contrastar con el fondo oscuro.
