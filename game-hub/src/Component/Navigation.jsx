
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/rock-paper-scissors">Rock Paper Scissors</Link></li>
        <li><Link to="/tic-tac-toe">Tic Tac Toe</Link></li>
        <li><Link to="/wordle">Wordle</Link></li>
        <li><Link to="/memory-game">Memory Game</Link></li>
      </ul>
    </nav>
  )
}

export default Navigation;
