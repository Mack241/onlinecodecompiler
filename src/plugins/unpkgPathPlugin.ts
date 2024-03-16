import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage'

const fileCache = localforage.createInstance({
   name: 'filecache'
})

export const unpkgPathPlugin = (input: string) => {
   return {
      name: "unpkg-path-plugin",
      setup(build: esbuild.PluginBuild) {
         build.onResolve({ filter: /.*/ }, async (args: any) => {
            console.log('on Resolve', args)
            if (args.path == "index.js") {
               return { path: args.path, namespace: 'a' };
            }

            if (args.path.includes('./') || args.path.includes('../')) {
               return {
                  namespace: 'a',
                  path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href
               }
            }

            return {
               path: `https://unpkg.com/${args.path}`,
               namespace: 'a'
            }
         })

         build.onLoad({ filter: /.*/ }, async (args: any) => {
            console.log('on Load', args)

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
      },
   };
};