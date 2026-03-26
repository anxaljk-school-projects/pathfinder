import { defineConfig } from 'vite'
import * as path from "node:path";

export default defineConfig({
  base: '/pathfinder/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
