import { useState } from 'react'
import PostGrid from './components/posts/PostGrid';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>  
      <h1>REACT CHAT</h1>
      <PostGrid/>
    </>
  )
}

export default App
