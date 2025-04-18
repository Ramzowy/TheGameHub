
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const RockPaperScissorsGame = () => {

  const location = useLocation();
  const userName = location.state?.userName;

  // Game constants
  const CHOICES = ['rock', 'paper', 'scissors'];
  const OUTCOMES = {
    rock: { rock: 0, paper: -1, scissors: 1 },
    paper: { rock: 1, paper: 0, scissors: -1 },
    scissors: { rock: -1, paper: 1, scissors: 0 }
  };

  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState('rock');

  // Game logic
  const playRound = (userChoice) => {
    const cpuChoice = CHOICES[Math.floor(Math.random() * 3)];
    const result = OUTCOMES[userChoice][cpuChoice];
    
    let outcomeMessage;
    let newUserScore = userScore;
    let newCpuScore = cpuScore;

    if (result === 1) {
      newUserScore++;
      outcomeMessage = `${userName} wins! ${userChoice} beats ${cpuChoice}`;
    } else if (result === -1) {
      newCpuScore++;
      outcomeMessage = `CPU wins! ${cpuChoice} beats ${userChoice}`;
    } else {
      outcomeMessage = `It's a tie! Both chose ${userChoice}`;
    }

    setUserScore(newUserScore);
    setCpuScore(newCpuScore);
    setGameHistory([outcomeMessage, ...gameHistory]);
  };

  // Handlers
  const handleStartGame = () => {
    if (userName.trim().length >= 2) {
      setGameStarted(true);
    }
  };

  const handlePlay = () => {
    playRound(selectedChoice);
  };

  // Render welcome screen
  // if (!gameStarted) {
  //   return (
  //     <div>
  //       <h1>Welcome to Rock Paper Scissors!</h1>
  //       <div>
  //         <label>
  //           Enter your name:
  //           <input
  //             type="text"
  //             value={userName}
  //             onChange={(e) => setUserName(e.target.value)}
  //             minLength={2}
  //             maxLength={15}
  //             required
  //           />
  //         </label>
  //       </div>
  //       <button 
  //         onClick={handleStartGame}
  //         disabled={userName.trim().length < 2}
  //       >
  //         Start Game
  //       </button>
  //     </div>
  //   );
  // }

  // Render game screen
  return (
    <div>
      <h1>Rock Paper Scissors</h1>
      
      <div>
        <h2>Score</h2>
        <p>{userName}: {userScore} vs CPU: {cpuScore}</p>
      </div>
      
      <div>
        <h2>Make your choice</h2>
        <select 
          value={selectedChoice}
          onChange={(e) => setSelectedChoice(e.target.value)}
        >
          {CHOICES.map(choice => (
            <option key={choice} value={choice}>
              {choice.charAt(0).toUpperCase() + choice.slice(1)}
            </option>
          ))}
        </select>
        <button onClick={handlePlay}>Play</button>
      </div>
      
      <div>
        <h2>Game History</h2>
        {gameHistory.length === 0 ? (
          <p>No games played yet</p>
        ) : (
          <ul>
            {gameHistory.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RockPaperScissorsGame;

