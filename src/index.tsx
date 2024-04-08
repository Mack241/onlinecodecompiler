import 'bulmaswatch/superhero/bulmaswatch.min.css'
import ReactDOM from "react-dom/client";
import { useState } from "react";
import CodeEditor from './components/code-editor';
import Preview from './components/preview';
import bundle from './bundler'

const el = document.getElementById('root');

const root = ReactDOM.createRoot(el!)

const App = () => {
    const [input, setInput] = useState('');
    const [code, setCode] = useState('');

    const onClick = async () => {
        const output = await bundle(input);
        setCode(output)
    }

    return (
        <div>
            <CodeEditor
                initialValue=''
                onChange={(value) => setInput(value)}
            />
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <Preview code={code} />
        </div>
    )
}

root.render(<App />)