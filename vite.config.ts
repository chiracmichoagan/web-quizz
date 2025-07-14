import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url';
import { URL } from 'url';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({mode }) => {

  return {
    plugins: [ vue(),
       tailwindcss(),
     ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      strictPort: true,
      port: 5000,
      host: "::", //'0.0.0.0',
    },
    esbuild: {
      drop: mode == "production" ? [ "console", "debugger" ] : []
    }
  };

})
