import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port : 3000,
    proxy : {
      // Get rid of the CORS error
      "/api" : {
        target : "http://localhost:4000",
        changeOrigin : true,
        secure : false,
      }
    }
  }
})
