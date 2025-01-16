import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
// import path from 'path'
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'
// import Inspect from 'vite-plugin-inspect'

// export default defineConfig({
//   plugins: [react(), Inspect()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
//   server: {
//     hmr: true,
//   },
//   optimizeDeps: {
//     include: ['react', 'react-dom'],
//   },
//   esbuild: {
//     jsxInject: `import React from 'react'`,
//   },
// })
