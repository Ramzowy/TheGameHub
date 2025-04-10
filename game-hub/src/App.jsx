import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Game from './pages/tic-tac-toe';
import { createBrowserRouter } from 'react-router-dom';
import Navigation from './Component/Navigation';
import RockPaperScissorsGame from './pages/rock-paper-scissors';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <Routes>
      <Route index element={<HomePage/>} />
      <Route path="/rock-paper-scissors" element={<RockPaperScissorsGame/>} />
      <Route path="/tic-tac-toe" element={<Game/>} />
    </Routes>
    </>
  )
}

export default App
