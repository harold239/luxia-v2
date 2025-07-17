import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev');

const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html' // Esto permite que todas las rutas funcionen como SPA
    }),
    paths: {
      base: dev ? '' : '/barberia-independiente' // Solo usa base path en producción
    },
    prerender: {
      entries: [] // Esto evita que Svelte intente pre-renderizar páginas dinámicas
    }
  }
};

export default config;

