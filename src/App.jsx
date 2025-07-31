import { useState } from 'react'
import GrapesJsEditor from './GrapesJsEditor.jsx' 
import './App.css'

function App() {
  const [editor, setEditor] = useState(null)

  const handleEditorReady = (editorInstance) => {
    setEditor(editorInstance)
    console.log('GrapesJS Editor is ready:', editorInstance)
  }

  return (
    <div className="App h-screen overflow-hidden">
      <GrapesJsEditor onEditorReady={handleEditorReady} />
    </div>
  )
}

export default App
