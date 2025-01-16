import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig({
  // server: {
  //   proxy: {
  //     '/api/v1': {
  //       target: 'https://bonntonn.up.railway.app', // Backend URL
  //       changeOrigin: true, // Change the origin header to match the target
  //       rewrite: (path) => path.replace(/^\/api\/v1/, '/api/v1'), // Optional: Keep the path
  //       secure: false, // If your backend SSL is misconfigured, set this to false
  //     },
  //   },
  // },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
