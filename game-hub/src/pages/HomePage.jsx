
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
            <Link to="/slingo-game">Slingo</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default HomePage;

