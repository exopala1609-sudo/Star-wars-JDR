import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Chemins relatifs : nécessaire pour que l'app fonctionne une
  // fois hébergée sur GitHub Pages (sous-dossier /Star-wars-JDR/)
  base: './',
  plugins: [react(), tailwindcss()],
})
