import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';
import { VantResolver,ElementPlusResolver  } from 'unplugin-vue-components/resolvers';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
    Components({
      resolvers: [VantResolver(), ElementPlusResolver()],
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
   
  ],
  server: {
    host: '192.168.0.101',
    port: "8080",
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  
})
