import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {//Redirige automaticamente las peticiones a los puertos, eliminado CORS en desarrollo
      '/runge_kutta': {
        target: 'http://localhost:3006',
        changeOrigin: true
      }
    }
  }
})
