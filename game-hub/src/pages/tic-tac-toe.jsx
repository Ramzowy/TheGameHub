import { useState, useEffect } from 'react';

function Square({ value, onSquareClick, disabled }) {
  return (
    <button className="square" onClick={onSquareClick} disabled={disabled}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, isMyTurn }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares) || !isMyTurn) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = isMyTurn 
      ? `Your turn (${xIsNext ? 'X' : 'O'})` 
      : `Waiting for opponent (${xIsNext ? 'X' : 'O'})`;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} disabled={!isMyTurn} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} disabled={!isMyTurn} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} disabled={!isMyTurn} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} disabled={!isMyTurn} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} disabled={!isMyTurn} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} disabled={!isMyTurn} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} disabled={!isMyTurn} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} disabled={!isMyTurn} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} disabled={!isMyTurn} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [roomId, setRoomId] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const isMyTurn = (xIsNext && playerSymbol === 'X') || (!xIsNext && playerSymbol === 'O');

  useEffect(() => {
    if (!roomId) return;

    const interval = setInterval(() => {
      fetchGameState(roomId);
    }, 2000);

    return () => clearInterval(interval);
  }, [roomId, currentMove]);

  async function createRoom() {
    setIsLoading(true);
    try {
      const response = await fetch('https://game-room-api.fly.dev/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initialState: {
            board: currentSquares,
            currentPlayer: 'X',
            history: history,
            currentMove: currentMove,
            playerSymbols: { host: 'X', guest: 'O' }
          },
        }),
      });
      const data = await response.json();
      setRoomId(data.roomId);
      setIsHost(true);
      setPlayerSymbol('X');
      setError(null);
    } catch (err) {
      setError('Failed to create room');
    } finally {
      setIsLoading(false);
    }
  }

  async function joinRoom(roomCode) {
    setIsLoading(true);
    try {
      const response = await fetch(`https://game-room-api.fly.dev/api/rooms/${roomCode}`);
      const data = await response.json();

      if (data.gameState) {
        setRoomId(roomCode);
        setHistory(data.gameState.history);
        setCurrentMove(data.gameState.currentMove);
        setPlayerSymbol('O');
        setError(null);
      } else {
        setError('Room not found');
      }
    } catch (err) {
      setError('Failed to join room');
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchGameState(roomId) {
    try {
      const response = await fetch(`https://game-room-api.fly.dev/api/rooms/${roomId}`);
      const data = await response.json();

      if (data.gameState) {
        if (data.gameState.currentMove !== currentMove) {
          setHistory(data.gameState.history);
          setCurrentMove(data.gameState.currentMove);
        }
      }
    } catch (err) {
      console.error('Error fetching game state:', err);
    }
  }

  async function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const newMove = nextHistory.length - 1;

    setHistory(nextHistory);
    setCurrentMove(newMove);

    if (roomId) {
      try {
        await fetch(`https://game-room-api.fly.dev/api/rooms/${roomId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gameState: {
              board: nextSquares,
              currentPlayer: newMove % 2 === 0 ? 'X' : 'O',
              history: nextHistory,
              currentMove: newMove,
              playerSymbols: { host: 'X', guest: 'O' }
            },
          }),
        });
      } catch (err) {
        console.error('Error updating game state:', err);
      }
    }
  }

  async function jumpTo(nextMove) {
    const newHistory = history.slice(0, nextMove + 1);
    const newSquares = newHistory[nextMove];
    
    // Update local state
    setHistory(newHistory);
    setCurrentMove(nextMove);

    if (roomId) {
      try {
        // Update server state
        await fetch(`https://game-room-api.fly.dev/api/rooms/${roomId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gameState: {
              board: newSquares,
              currentPlayer: nextMove % 2 === 0 ? 'X' : 'O',
              history: newHistory,
              currentMove: nextMove,
              playerSymbols: { host: 'X', guest: 'O' }
            },
          }),
        });
      } catch (err) {
        console.error('Error updating game state:', err);
      }
    }
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if (!roomId) {
    return (
      <div className="game-setup">
        <h2>Tic-Tac-Toe Multiplayer</h2>
        <div>
          <button onClick={createRoom} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create New Game'}
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter room code"
            id="roomCode"
          />
          <button
            onClick={() => joinRoom(document.getElementById('roomCode').value)}
            disabled={isLoading}
          >
            {isLoading ? 'Joining...' : 'Join Game'}
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    );
  }

  return (
    <div className="game">
      <div className="game-info">
        <div>Room: {roomId} {isHost ? '(X - Host)' : '(O - Guest)'}</div>
      </div>
      <div className="game-board">
        <Board 
          xIsNext={xIsNext} 
          squares={currentSquares} 
          onPlay={handlePlay} 
          isMyTurn={isMyTurn}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}