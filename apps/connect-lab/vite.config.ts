import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config
export default defineConfig({
  base: '/appkit-adapters/',
  plugins: [
    devtools(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    svgr(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
