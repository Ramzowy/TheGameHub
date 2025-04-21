<<<<<<< HEAD
import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import RockPaperScissorsGame from './rock-paper-scissors';
import TTT from './tic-tac-toe';
import Slingo from './slingo-game';
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
        <Route path="/slingo-game" element={<Slingo />} />

        <Route path="/signin" element={<SignIn />} />
      </Routes>
=======

import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>GameHub</h1>
      <p>Welcome to GameHub - Your gaming portal!</p>
      
      <nav>
        <h2>Available Games:</h2>
        <ul>
          <li>
            <Link to="/rock-paper-scissors">Rock Paper Scissors</Link>
          </li>
          <li>
            <Link to="/tic-tac-toe">Tic Tac Toe</Link>
          </li>
          <li>
            <Link to="/wordle">Wordle</Link>
          </li>
          <li>
            <Link to="/memory-game">Memory Game</Link>
          </li>
        </ul>
      </nav>
>>>>>>> origin/main
    </div>
  );
}

<<<<<<< HEAD
export default Hub;
=======
export default HomePage;

>>>>>>> origin/main
