
import { useState } from 'react'
import './App.css'
import PPTGenerator from './Mainform'
import Plagiarism from './Plagrithm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <PPTGenerator/>
      {/* <Plagiarism/> */}
    </>
  )
}

export default App
