import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
       proxy:{
        '/api':{
          target:'https://billstack.onrender.com',
          secure:false,
          
        }
       }
  },
  plugins: [react()],
})
