import { defineConfig } from 'tsdown'

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    outDir: 'dist',
    dts: false,
    sourcemap: false,
    external: [
        'fs',
        'path',
        'os',
        'dotenv'
    ],
    clean: true
}) 