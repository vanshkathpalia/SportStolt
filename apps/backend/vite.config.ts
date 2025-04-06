// import { defineConfig } from 'vite'
// import path from 'path'

// export default defineConfig({
//   build: {
//     outDir: 'dist',
//     lib: {
//       entry: path.resolve(__dirname, 'src/index.ts'),
//       formats: ['es'],
//       fileName: () => 'index.js',
//     },
//     rollupOptions: {
//       output: {
//         entryFileNames: 'index.js',
//       },
//       external: [],
//     },
//     target: 'esnext',
//     minify: false,
//     emptyOutDir: true,
//   },
//   optimizeDeps: {
//     exclude: ['@prisma/client/edge']
//   },
//   ssr: {
//     noExternal: ['@prisma/client/edge'],
//   },
// })
