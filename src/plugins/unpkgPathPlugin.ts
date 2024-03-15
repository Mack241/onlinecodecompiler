import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
   return {
      name: "unpkg-path-plugin",
      setup(build: esbuild.PluginBuild) {
         build.onResolve({ filter: /.*/ }, async (args: any) => {
            console.log('on Resolve', args)
            return { path: args.path, namespace: 'a' };
         })

         build.onLoad({ filter: /.*/ }, async (args: any) => {
            console.log('on Load', args)

            if(args.path === 'index.js') {
               return {
                  loader: 'jsx',
                  contents: `
                     import message from 'tiny-test-pkg'; 
                     console.log(message);
                  `,
               };
            }
         });
      },
   };
};