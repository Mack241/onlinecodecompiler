import './code-editor.css'
import { useRef } from 'react'
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

interface CodeEditorProps {
   initialValue: string,
   onChange(value: string): void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
   const editorRef = useRef<any>();

   const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
      editorRef.current = monacoEditor
      monacoEditor.onDidChangeModelContent(() => {
         onChange(getValue())
      })

      monacoEditor.getModel()?.updateOptions({ tabSize: 2 });
   }

   const onFormatClick = () => {
      const unformatted = editorRef.current.getModel().getValue();

      const formatted = prettier.format(unformatted, {
         parser: 'babel',
         plugins: [parser],
         useTabs: false,
         semi: true,
         singleQuote: true
      }).replace(/\n$/, '')

      editorRef.current.setValue(formatted)
   }

   return (
      <div className='editor-wrapper'>
         <button className='button button-format is-primary is-small' onClick={onFormatClick}>Format</button>
         <MonacoEditor
            editorDidMount={onEditorDidMount}
            value={initialValue}
            language="javascript"
            height="100%"
            theme='dark'
            options={{
               wordWrap: 'on',
               minimap: { enabled: false },
               showUnused: false,
               folding: false,
               lineNumbersMinChars: 3,
               fontSize: 16,
               scrollBeyondLastLine: false,
               automaticLayout: true
            }} />
      </div>
   )
}

export default CodeEditor;