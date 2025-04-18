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