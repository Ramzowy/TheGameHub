import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/rock-paper-scissors.css';

const API_BASE = 'https://game-room-api.fly.dev/api/rooms';

const RockPaperScissorsGame = () => {
  const location = useLocation();
  const userName = location.state?.userName || 'Player';

  // Game constants
  const CHOICES = ['rock', 'paper', 'scissors'];
  const OUTCOMES = {
    rock: { rock: 0, paper: -1, scissors: 1 },
    paper: { rock: 1, paper: 0, scissors: -1 },
    scissors: { rock: -1, paper: 1, scissors: 0 }
  };

  const [myRoomId, setMyRoomId] = useState('');
  const [inputRoomId, setInputRoomId] = useState('');
  const [gameState, setGameState] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [roundResult, setRoundResult] = useState(null);

  const [selectedChoice, setSelectedChoice] = useState('rock');

  useEffect(() => {
    async function createRoom() {
      const initialState = {
        players: {
          [userName]: { choice: null, score: 0 }
        },
        gameStarted: false,
        winner: null,
        lastRound: null,
      };
      try {
        const res = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initialState }),
        });
        if (!res.ok) throw new Error('Create room failed');
        const data = await res.json();
        setMyRoomId(data.roomId);
        setInputRoomId(data.roomId);
      } catch (e) {
        console.error(e);
      }
    }
    createRoom();
  }, [userName]);


  useEffect(() => {
    if (!inputRoomId || !gameStarted) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/${inputRoomId}`);
        if (!res.ok) throw new Error('Fetch room failed');
        const data = await res.json();
        if (!data.gameState) return;

        setGameState(data.gameState);

        if (data.gameState.winner) {
          setWinner(data.gameState.winner);
          setGameStarted(false);
          clearInterval(interval);
        }

        if (data.gameState.lastRound) {
          setRoundResult(data.gameState.lastRound);
        } else {
          setRoundResult(null);
        }
      } catch (e) {
        console.error(e);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [inputRoomId, gameStarted]);

  const joinRoom = async () => {
    if (!inputRoomId.trim()) {
      alert('Please enter a room code');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/${inputRoomId}`);
      if (!res.ok) throw new Error('Room not found');
      const data = await res.json();

      const players = { ...data.gameState.players };
      players[userName] = players[userName] || { choice: null, score: 0 };

      const updatedState = {
        ...data.gameState,
        players,
        gameStarted: true,
        winner: null,
        lastRound: null,
      };

      const putResponse = await fetch(`${API_BASE}/${inputRoomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameState: updatedState }),
      });
      if (!putResponse.ok) throw new Error('Failed updating room for join');

      setGameState(updatedState);
      setGameStarted(true);
      setWinner(null);
      setRoundResult(null);
      setMyRoomId(inputRoomId);
    } catch (e) {
      alert('Invalid room code or error joining room.');
      console.error(e);
    }
  };

  const submitChoice = async (choice) => {
    if (!gameStarted || winner) return;

    if (!inputRoomId) {
      alert("You're not in a room!");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/${inputRoomId}`);
      if (!res.ok) throw new Error('Room fetch failed on submit choice');
      const data = await res.json();
      const players = { ...data.gameState.players };
      players[userName] = players[userName] || { choice: null, score: 0 };
      players[userName].choice = choice;

      const updatedState = {
        ...data.gameState,
        players,
        lastRound: null,
      };

      const playerNames = Object.keys(players);
      if (
        playerNames.length >= 2 &&
        playerNames.every(p => players[p].choice !== null)
      ) {
        const [p1, p2] = playerNames;
        const c1 = players[p1].choice;
        const c2 = players[p2].choice;
        const outcome = OUTCOMES[c1]?.[c2] ?? 0;

        let roundWinner = null;
        let roundText = '';
        if (outcome === 1) {
          players[p1].score++;
          roundWinner = p1;
          roundText = `${p1} wins the round! ${c1} beats ${c2}`;
        } else if (outcome === -1) {
          players[p2].score++;
          roundWinner = p2;
          roundText = `${p2} wins the round! ${c2} beats ${c1}`;
        } else {
          roundText = `It's a tie! Both chose ${c1}`;
        }

        for (const p of playerNames) players[p].choice = null;

        const gameWinner = playerNames.find(p => players[p].score >= 3);

        updatedState.players = players;
        updatedState.winner = gameWinner || null;
        updatedState.gameStarted = !gameWinner;

        updatedState.lastRound = {
          winner: roundWinner,
          text: roundText,
          choices: {
            [p1]: c1,
            [p2]: c2,
          },
        };

        setWinner(gameWinner || null);
        setRoundResult(updatedState.lastRound);
      }

      const putResponse = await fetch(`${API_BASE}/${inputRoomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameState: updatedState }),
      });
      if (!putResponse.ok) throw new Error('Failed to update game state');

      setGameState(updatedState);
    } catch (e) {
      console.error(e);
    }
  };

  if (!myRoomId) {
    return <div className="container">Loading your room code...</div>;
  }

  if (!gameStarted) {
    return (
      <div className="container">
        <h1>Rock Paper Scissors Multiplayer</h1>
        <div>
          <p className="room-code">
            Your Room Code: <code>{myRoomId}</code>
          </p>
          <label htmlFor="room-code-input">
            Enter room code to join:
            <input
              id="room-code-input"
              type="text"
              value={inputRoomId}
              onChange={e => setInputRoomId(e.target.value.toUpperCase())}
            />
          </label>
          <button onClick={joinRoom}>Play</button>
          <p style={{ marginTop: 12 }}>
            Share your room code with a friend. When both join the same room and click Play, the game starts.
          </p>
        </div>

        {winner && (
          <div style={{ marginTop: 20 }}>
            <h2>
              {winner === 'None' ? 'Game ended with no winner' : `Winner: ${winner}`}
            </h2>
          </div>
        )}
      </div>
    );
  }

  if (!gameState) {
    return <div className="container">Loading game state...</div>;
  }

  const getOpponentDisplayChoice = () => {
    const players = gameState.players || {};
    const opponents = Object.keys(players).filter(p => p !== userName);
    if (opponents.length === 0) return 'Waiting for opponent...';
    const opponent = opponents[0];
    if (!players[opponent]) return 'Waiting for opponent...';

    if (
      roundResult &&
      roundResult.choices &&
      roundResult.choices[opponent] &&
      Object.values(players).every((pl) => pl.choice === null)
    ) {
      return roundResult.choices[opponent];
    }
    return '?';
  };

  const getRoundResultClass = () => {
    if (!roundResult) return '';
    if (roundResult.winner === null) return 'round-result tie';
    if (roundResult.winner === userName) return 'round-result win';
    return 'round-result lose';
  };

  return (
    <div className="container">
      

      {winner ? (
        <div style={{ marginBottom: 20 }}>
          <h2>
            {winner === 'None'
              ? 'Game ended with no winner'
              : winner === userName
              ? '🎉 You won the game! 🎉'
              : `Winner: ${winner}`}
          </h2>
          <button
            onClick={async () => {
              if (!inputRoomId) return;
              try {
                const response = await fetch(`${API_BASE}/${inputRoomId}`);
                if (!response.ok) throw new Error('Room fetch failed on reset');
                const data = await response.json();
                const players = data.gameState.players || {};
                for (const p in players) {
                  players[p].score = 0;
                  players[p].choice = null;
                }
                const resetState = {
                  players,
                  gameStarted: true,
                  winner: null,
                  lastRound: null,
                };
                const putResponse = await fetch(`${API_BASE}/${inputRoomId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ gameState: resetState }),
                });
                if (!putResponse.ok) throw new Error('Failed to reset game');
                setGameState(resetState);
                setWinner(null);
                setRoundResult(null);
                setGameStarted(true);
              } catch (e) {
                console.error(e);
              }
            }}
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <h3>Scores</h3>
            <ul>
              {gameState.players &&
                Object.entries(gameState.players).map(([player, data]) => (
                  <li key={player}>
                    {player}: {data.score}
                    {player === userName && ' (You)'}
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h3>Make your choice</h3>
            <select
              className="choice-select"
              value={selectedChoice}
              onChange={e => setSelectedChoice(e.target.value)}
              disabled={!!gameState?.players?.[userName]?.choice}
            >
              {CHOICES.map(choice => (
                <option key={choice} value={choice}>
                  {choice.charAt(0).toUpperCase() + choice.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={() => submitChoice(selectedChoice)}
              disabled={!!gameState?.players?.[userName]?.choice}
            >
              Submit Choice
            </button>
            {gameState?.players?.[userName]?.choice && (
              <p>You submitted: {gameState.players[userName].choice}</p>
            )}
          </div>

          <div className="opponent-choice">
            <h3>Opponent's Choice</h3>
            <p>{getOpponentDisplayChoice()}</p>
          </div>

          <div className={getRoundResultClass()}>
            <h3>Round Result</h3>
            {roundResult ? (
              <p>{roundResult.text}</p>
            ) : (
              <p>Waiting for both players to submit choices...</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RockPaperScissorsGame;