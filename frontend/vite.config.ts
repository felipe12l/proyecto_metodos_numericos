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
      },
      '/secante': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/fixed_point': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/gauss_seidel': {
        target: 'http://localhost:3003',
        changeOrigin: true
      },
      '/jacobi': {
        target: 'http://localhost:3002',
        changeOrigin: true
      },
      '/simpson': {
        target: 'http://localhost:3008',
        changeOrigin: true
      }
    }
    
  }
})
