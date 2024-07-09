import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  imports: false,
  manifest: {
    permissions: ['tabs', 'webNavigation', 'scripting'],
  },
  vite: () => ({
    esbuild: {
     // drop: ['console', 'debugger'],
    },
  }),
})
