import adapter from '@sveltejs/adapter-static';

const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html' // Muy importante para que Netlify funcione como SPA
    }),
    paths: {
      base: '' // Elimina rutas adicionales, sirve desde raíz
    },
    prerender: {
      entries: ['*'] // Renderiza todas las rutas disponibles
    }
  }
};

export default config;



