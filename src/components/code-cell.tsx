import { useEffect, useState } from "react";
import CodeEditor from './code-editor';
import Preview from './preview';
import bundle from '../bundler'
import Resizable from "./resizable";

const CodeCell = () => {
   const [input, setInput] = useState('');
   const [code, setCode] = useState('');

   useEffect(() => {
      const timer = setTimeout(async () => {
         const output = await bundle(input);
         setCode(output)
      }, 1000)

      return () => {
         clearTimeout(timer)
      }
   }, [input])

   return (
      <Resizable direction="vertical">
         <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
            <Resizable direction="horizontal">
               <CodeEditor
                  initialValue=''
                  onChange={(value) => setInput(value)}
               />
            </Resizable>
            <Preview code={code} />
         </div>
      </Resizable>
   )
}

export default CodeCell;