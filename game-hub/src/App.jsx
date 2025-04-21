<<<<<<< HEAD
import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import SignInAction from './pages/signin';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignInAction />} />
      <Route path="/HomePage/*" element={<HomePage/>} />
    </Routes>
  );
}

export default App;
    //    /* <Routes>
    //   <Route index element={<HomePage/>} />
    //   <Route path="/rock-paper-scissors" element={<RockPaperScissorsGame/>} />
    //   <Route path="/tic-tac-toe" element={<Game/>} />
    //   <Route path="/slingo-game" element={<SlingoGame/>} />
    // </Routes>
=======
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Game from './pages/tic-tac-toe';
import { createBrowserRouter } from 'react-router-dom';
import Navigation from './Component/Navigation';
import MemoryGame from './pages/MemoryGame';
import RockPaperScissorsGame from './pages/rock-paper-scissors';
import WordleGame from './pages/Wordle';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <Routes>
      <Route index element={<HomePage/>} />
      <Route path="/rock-paper-scissors" element={<RockPaperScissorsGame/>} />
      <Route path="/tic-tac-toe" element={<Game/>} />
      <Route path="/wordle" element={<WordleGame/>} />
      <Route path="/memory-game" element={<MemoryGame/>} />
    </Routes>
    </>
  )
}

export default App
>>>>>>> origin/main
