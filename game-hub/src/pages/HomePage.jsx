import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import RockPaperScissorsGame from './rock-paper-scissors';
import TTT from './tic-tac-toe';
import Slingo from './slingo-game';
import Wordle from './Wordle';
import MemoryGame from './MemoryGame';
import SignIn from './signin';
import Navigation from '../Component/Navigation';

function Hub() {
  const location = useLocation();
  const userName = location.state?.userName;

  return (
    <div className="hub">
      <Navigation userName={userName}/>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              
              <h1>Welcome to GameHub, {userName}!</h1>
              <p>
                Explore a variety of games from the list above.
              </p>
            </div>
          }
        />
        <Route path="/rock-paper-scissors" element={<RockPaperScissorsGame />} />
        <Route path="/tic-tac-toe" element={<TTT />} />
        <Route path="/wordle" element={<Wordle />} />
        <Route path="/memorygame" element={<MemoryGame />} />
        <Route path="/slingo-game" element={<Slingo />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </div>
  );
}

export default Hub;
