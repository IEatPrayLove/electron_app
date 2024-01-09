import {defineConfig} from "vite";
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import path from 'path'
import {rmSync} from "fs"
import pkg from './package.json'

export default defineConfig(({command}) => {
    rmSync('dist-electron', {recursive: true, force: true});
    const isServe = command === 'serve'
    const isBuild = command === 'build';
    const sourcemap = isServe || !!process.env.VSCODE_DEBUG
    return {
        plugins: [
            react(),
            electron({
                entry: 'electron/main/index.ts',
                vite: {
                    build: {
                        sourcemap,
                        minify: isBuild,
                        outDir: 'dist-electron/main',
                        rollupOptions: {
                            external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
                        },
                    },
                },
                onstart(args) {
                    if (process.env.VSCODE_DEBUG) {
                        console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
                    } else {
                        void args.startup()
                    }
                },
            })
        ],
        resolve: {
            alias: {
                '@': path.join(__dirname, 'src')
            },
        },
    }
})