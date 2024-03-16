import * as esbuild from 'esbuild-wasm'
import axios from 'axios'
import localforage from 'localforage'

const fileCache = localforage.createInstance({
   name: 'filecache'
})

export const fetchPlugin = (input: string) => {
   return {
      name: 'fetch-plugn',
      setup(build: esbuild.PluginBuild) {
         build.onLoad({ filter: /.*/ }, async (args: any) => {
            if (args.path === 'index.js') {
               return {
                  loader: 'jsx',
                  contents: input,
               };
            }

            const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path)

            if (cachedResult) {
               return cachedResult;
            }

            const { data, request } = await axios.get(args.path);

            const result: esbuild.OnLoadResult = {
               loader: 'jsx',
               contents: data,
               resolveDir: new URL('./', request.responseURL).pathname
            }

            await fileCache.setItem(args.path, result);

            return result;
         });
      }
   }
}