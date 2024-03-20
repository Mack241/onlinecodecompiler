import * as esbuild from 'esbuild-wasm';
import ReactDOM from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import { unpkgPathPlugin } from './plugins/unpkgPathPlugin';
import { fetchPlugin } from './plugins/fetchpulgin';

import CodeEditor from './components/code-editor';

const el = document.getElementById('root');

const root = ReactDOM.createRoot(el!)

const App = () => {
    const [input, setInput] = useState('');
    const ref = useRef<any>();
    const iframe = useRef<any>();

    const startService = async () => {
        ref.current = await esbuild.startService({
            worker: true,
            wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
        })
    }

    useEffect(() => {
        startService();
    }, [])

    const onClick = async () => {
        if (!ref.current) {
            return;
        }

        iframe.current.srcDoc = html;

        const result = await ref.current.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [
                unpkgPathPlugin(),
                fetchPlugin(input)
            ],
            define: {
                'process.env.NODE_ENV': '"development"',
                global: 'window'
            }
        })

        iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*')
    }

    const html = `
      <html>
        <head></head>
        <body>
            <div id="root"></div>
            <script>
                window.addEventListener('message', (event) => {
                    try {
                        eval(event.data);
                    }catch(err) {
                        const root = document.querySelector('#root');
                        root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>'
                        throw err;
                    }
                }, false)
            </script>
        </body>
      </html>  
    `;

    return (
        <div>
            <CodeEditor
                initialValue=''
                onChange={(value) => setInput(value)}
            />
            <textarea value={input} onChange={e => setInput(e.target.value)}></textarea>
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <iframe title='preview' ref={iframe} sandbox='allow-scripts' srcDoc={html} />
        </div>
    )

}

root.render(<App />)