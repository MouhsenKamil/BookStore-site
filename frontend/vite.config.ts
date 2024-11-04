import { defineConfig, loadEnv } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'


export default defineConfig(({ mode }) => {
  const parent_dir = path.resolve(__dirname, '..')
  const env = loadEnv(mode, parent_dir, '')

  return {
    plugins: [react()],
    envDir: "../",
    server: {
      proxy: {
        '/api': {
          target: `https://localhost:${env.BACKEND_PORT}`,
          changeOrigin: true,
          secure: false,
        }
      }
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
})
