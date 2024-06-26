import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkgPathPlugin';
import { fetchPlugin } from './plugins/fetchpulgin';

let service: esbuild.Service;
export default async (rawCode: string) => {
   if (!service) {
      service = await esbuild.startService({
         worker: true,
         wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
      })
   }

   const result = await service.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [
         unpkgPathPlugin(),
         fetchPlugin(rawCode)
      ],
      define: {
         'process.env.NODE_ENV': '"development"',
         global: 'window'
      }
   })

   return result.outputFiles[0].text
}