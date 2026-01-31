import { defineConfig } from 'tsdown'

export default defineConfig([
    {
        entry: {
            index: 'src/index.ts',
            contracts: 'src/Contracts/index.ts',
        },
        exports: true,
        format: ['esm', 'cjs'],
        outDir: 'dist',
        dts: true,
        sourcemap: false,
        external: [
            'fs',
            'path',
            'os',
            'dotenv'
        ],
        clean: true
    },
]) 