import { defineConfig } from 'tsdown'
import { rmSync } from 'node:fs'

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
        clean: true,
        hooks (hooks) {
            hooks.hook('build:done', (ctx) => {
                try {
                    // Get the absolute output directory
                    const outDir = ctx.options.outDir ?? 'dist'
                    // Delete unnecessary folders or files
                    rmSync(`${outDir}/contracts.cjs`)
                    rmSync(`${outDir}/contracts.js`)
                } catch (error) {
                    console.error('Error during post-build cleanup:', error)
                }
            })
        },
    },
]) 