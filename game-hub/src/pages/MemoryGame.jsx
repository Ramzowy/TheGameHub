import { useState, useEffect } from 'react';
import './MemoryGame.css';
import reactLogo from '../assets/react.svg';
import appleLogo from '../assets/apple.png';
import catLogo from '../assets/cat.jpg';
import image1 from '../assets/blue-bg-animal-faces.jpg';
import image2 from '../assets/animal-faces.jpg';
import image3 from '../assets/mickey-mouse.png';

// Card data - using react.svg for all cards, but we'll pair them differently
const cardImages = [
  { id: 1, image: reactLogo, alt: 'Card 1', matched: false, pairId: 1 },
  { id: 2, image: reactLogo, alt: 'Card 2', matched: false, pairId: 1 },
  { id: 3, image: catLogo, alt: 'Card 3', matched: false, pairId: 2 },
  { id: 4, image: catLogo, alt: 'Card 4', matched: false, pairId: 2 },
  { id: 5, image: appleLogo, alt: 'Card 5', matched: false, pairId: 3 },
  { id: 6, image: appleLogo, alt: 'Card 6', matched: false, pairId: 3 },
  { id: 7, image: image1, alt: 'Card 7', matched: false, pairId: 4 },
  { id: 8, image: image1, alt: 'Card 8', matched: false, pairId: 4 },
  { id: 9, image: image2, alt: 'Card 9', matched: false, pairId: 5 },
  { id: 10, image: image2, alt: 'Card 10', matched: false, pairId: 5 },
  { id: 11, image: image3, alt: 'Card 11', matched: false, pairId: 6 },
  { id: 12, image: image3, alt: 'Card 12', matched: false, pairId: 6 },
];

const API_URL = 'https://game-room-api.fly.dev/api';

const Card = ({ card, handleChoice, flipped, matched }) => {
  return (
    <div 
      className={`card ${flipped ? 'toggled' : ''} ${matched ? 'matched' : ''}`} 
      onClick={() => !matched && handleChoice(card)}
    >
      <div className="outline-image"></div>
      <img src={card.image} className="card-image" alt={card.alt} />
    </div>
  );
};

const GameHeader = ({ playerName, isHost, opponentInfo }) => {
  return (
    <div className="heading-container">
      <h1 className="gfg-heading">Earl-Rahim</h1>
      <h2 className="game-heading">Click any card to flip it!</h2>
      {opponentInfo && (
        <div className="player-info">
          <p>
            You ({playerName}) - Moves: {opponentInfo.playerMoves} | 
            {opponentInfo.opponentName ? ` Opponent (${opponentInfo.opponentName}) - Moves: ${opponentInfo.opponentMoves}` : " Waiting for opponent..."}
          </p>
        </div>
      )}
    </div>
  );
};

const GameProgress = ({ moves, handleRestart, gameEnded }) => {
  return (
    <div className="progress-container">
      <div className="move-counter"><p>Moves: {moves}</p></div>
      {!gameEnded && (
        <button className="restart-button" onClick={handleRestart}>
          Restart Game
        </button>
      )}
    </div>
  );
};

const RoomForm = ({ onCreateRoom, onJoinRoom }) => {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [formMode, setFormMode] = useState(''); // 'create' or 'join'
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerName) return;
    
    if (formMode === 'create') {
      onCreateRoom(playerName);
    } else if (formMode === 'join' && roomId) {
      onJoinRoom(playerName, roomId);
    }
  };
  
  return (
    <div className="room-form-container">
      <h1 className="gfg-heading">Memory Game Multiplayer</h1>
      <div className="form-buttons">
        <button 
          className={`form-button ${formMode === 'create' ? 'active' : ''}`} 
          onClick={() => setFormMode('create')}
        >
          Create a Room
        </button>
        <button 
          className={`form-button ${formMode === 'join' ? 'active' : ''}`}
          onClick={() => setFormMode('join')}
        >
          Join a Room
        </button>
      </div>
      
      {formMode && (
        <form onSubmit={handleSubmit} className="room-form">
          <div className="form-field">
            <label htmlFor="playerName">Your Name:</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
            />
          </div>
          
          {formMode === 'join' && (
            <div className="form-field">
              <label htmlFor="roomId">Room ID:</label>
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
              />
            </div>
          )}
          
          <button type="submit" className="submit-button">
            {formMode === 'create' ? 'Create Room' : 'Join Room'}
          </button>
        </form>
      )}
    </div>
  );
};

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [turnedCards, setTurnedCards] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  
  // Multiplayer state
  const [gameStarted, setGameStarted] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [opponentInfo, setOpponentInfo] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  // Initialize cards for the game
  const initializeCards = () => {
    const shuffledCards = [...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, matched: false }));
    
    setCards(shuffledCards);
    setTurnedCards([]);
    setDisabled(false);
    setMoves(0);
    setMatchedPairs(0);
    
    return shuffledCards;
  };

  // Update game state on the server
  const updateGameState = async (updatedState) => {
    try {
      const response = await fetch(`${API_URL}/rooms/${roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gameState: updatedState
        })
      });
      
      if (!response.ok) {
        console.error('Failed to update game state');
      }
    } catch (error) {
      console.error('Error updating game state:', error);
    }
  };

  // Fetch current game state from server
  const fetchGameState = async () => {
    try {
      const response = await fetch(`${API_URL}/rooms/${roomId}`);
      
      if (response.ok) {
        const data = await response.json();
        return data.gameState;
      } else {
        console.error('Failed to fetch game state');
        return null;
      }
    } catch (error) {
      console.error('Error fetching game state:', error);
      return null;
    }
  };

  // Start polling for game state updates
  const startPolling = () => {
    const interval = setInterval(async () => {
      const gameState = await fetchGameState();
      
      if (gameState) {
        // Update opponent info
        if (isHost) {
          if (gameState.player2) {
            setOpponentInfo({
              playerMoves: moves,
              opponentName: gameState.player2.name,
              opponentMoves: gameState.player2.moves,
              opponentMatchedPairs: gameState.player2.matchedPairs
            });
            
            // Check if opponent has finished the game
            if (gameState.player2.matchedPairs === cardImages.length / 2) {
              checkGameEnd(gameState.player2.moves, gameState.player2.name);
            }
          } else {
            setOpponentInfo({
              playerMoves: moves,
              opponentName: null,
              opponentMoves: 0,
              opponentMatchedPairs: 0
            });
          }
        } else {
          // Player 2 updates
          setOpponentInfo({
            playerMoves: moves,
            opponentName: gameState.player1.name,
            opponentMoves: gameState.player1.moves,
            opponentMatchedPairs: gameState.player1.matchedPairs
          });
          
          // Check if opponent (host) has finished the game
          if (gameState.player1.matchedPairs === cardImages.length / 2) {
            checkGameEnd(gameState.player1.moves, gameState.player1.name);
          }
        }
        
        // Check if cards were restarted by opponent
        if (gameState.restarted && gameState.restartedBy !== playerName) {
          setCards(gameState.cards);
          setTurnedCards([]);
          setDisabled(false);
          setMoves(0);
          setMatchedPairs(0);
          setGameEnded(false);
          setWinner(null);
        }
      }
    }, 2000); // Poll every 2 seconds
    
    setPollingInterval(interval);
  };

  const shuffleCards = () => {
    const shuffledCards = initializeCards();
    
    // Update game state with restarted flag
    if (roomId) {
      const gameState = isHost ? {
        player1: {
          name: playerName,
          moves: 0,
          matchedPairs: 0
        },
        player2: opponentInfo?.opponentName ? {
          name: opponentInfo.opponentName,
          moves: 0,
          matchedPairs: 0
        } : null,
        cards: shuffledCards,
        restarted: true,
        restartedBy: playerName
      } : {
        player1: {
          name: opponentInfo.opponentName,
          moves: 0,
          matchedPairs: 0
        },
        player2: {
          name: playerName,
          moves: 0,
          matchedPairs: 0
        },
        cards: shuffledCards,
        restarted: true,
        restartedBy: playerName
      };
      
      updateGameState(gameState);
    }
  };

  const handleChoice = (card) => {
    if (disabled || card.matched || turnedCards.some((c) => c.id === card.id)) {
      return;
    }
  
    const newTurnedCards = [...turnedCards, card];
    setTurnedCards(newTurnedCards);
  
    if (newTurnedCards.length === 2) {
      const newMoves = moves + 1;
      setMoves(newMoves);
      setDisabled(true);
  
      const isPair = newTurnedCards[0].pairId === newTurnedCards[1].pairId;
      let newMatchedPairs = matchedPairs;
  
      if (isPair) {
        // Wait 1 second before marking as matched and clearing turned cards
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.pairId === newTurnedCards[0].pairId
                ? { ...c, matched: true }
                : c
            )
          );
          
          newMatchedPairs = matchedPairs + 1;
          setMatchedPairs(newMatchedPairs);
          setTurnedCards([]);
          setDisabled(false);
          
          // Update game state with player's progress
          if (roomId) {
            updatePlayerProgress(newMoves, newMatchedPairs);
          }
        }, 1000);
      } 
      else {
        setTimeout(() => {
          setTurnedCards([]);
          setDisabled(false);
          
          // Update game state with player's progress
          if (roomId) {
            updatePlayerProgress(newMoves, matchedPairs);
          }
        }, 1000);
      }
    }
  };
  
  const updatePlayerProgress = (currentMoves, currentMatchedPairs) => {
    // Build updated game state based on player role
    let updatedGameState;
    
    if (isHost) {
      updatedGameState = {
        player1: {
          name: playerName,
          moves: currentMoves,
          matchedPairs: currentMatchedPairs
        },
        player2: opponentInfo?.opponentName ? {
          name: opponentInfo.opponentName,
          moves: opponentInfo.opponentMoves,
          matchedPairs: opponentInfo.opponentMatchedPairs
        } : null,
        cards: cards,
        restarted: false
      };
    } else {
      updatedGameState = {
        player1: {
          name: opponentInfo.opponentName,
          moves: opponentInfo.opponentMoves,
          matchedPairs: opponentInfo.opponentMatchedPairs
        },
        player2: {
          name: playerName,
          moves: currentMoves,
          matchedPairs: currentMatchedPairs
        },
        cards: cards,
        restarted: false
      };
    }
    
    updateGameState(updatedGameState);
  };

  const createRoom = async (name) => {
    try {
      // Initialize cards
      const shuffledCards = initializeCards();
      
      // Create initial game state
      const initialState = {
        player1: {
          name: name,
          moves: 0,
          matchedPairs: 0
        },
        player2: null,
        cards: shuffledCards,
        restarted: false
      };
      
      // Create room on server
      const response = await fetch(`${API_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          initialState: initialState
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setRoomId(data.roomId);
        setPlayerName(name);
        setIsHost(true);
        setGameStarted(true);
        
        setOpponentInfo({
          playerMoves: 0,
          opponentName: null,
          opponentMoves: 0,
          opponentMatchedPairs: 0
        });
        
        alert(`Room created! Your room ID is: ${data.roomId}`);
        
        // Start polling for opponent
        startPolling();
      } else {
        alert('Failed to create room. Please try again.');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Error connecting to game server. Please try again.');
    }
  };
  
  const joinRoom = async (name, id) => {
    try {
      // Fetch the room to check if it exists
      const response = await fetch(`${API_URL}/rooms/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        const gameState = data.gameState;
        
        // Check if room is full (already has player2)
        if (gameState.player2) {
          alert('This room is already full with 2 players.');
          return;
        }
        
        // Update game state with player2 info
        const updatedGameState = {
          ...gameState,
          player2: {
            name: name,
            moves: 0,
            matchedPairs: 0
          }
        };
        
        // Update room on server
        const updateResponse = await fetch(`${API_URL}/rooms/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            gameState: updatedGameState
          })
        });
        
        if (updateResponse.ok) {
          setRoomId(id);
          setPlayerName(name);
          setIsHost(false);
          setGameStarted(true);
          setCards(gameState.cards);
          
          setOpponentInfo({
            playerMoves: 0,
            opponentName: gameState.player1.name,
            opponentMoves: gameState.player1.moves,
            opponentMatchedPairs: gameState.player1.matchedPairs
          });
          
          // Start polling for game updates
          startPolling();
        } else {
          alert('Failed to join room. Please try again.');
        }
      } else {
        alert('Room not found. Please check the room ID and try again.');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Error connecting to game server. Please try again.');
    }
  };
  
  const checkGameEnd = (opponentFinalMoves, opponentPlayerName) => {
    if (matchedPairs === cardImages.length / 2) {
      // Both players finished
      if (moves < opponentFinalMoves) {
        setWinner(playerName);
        alert(`Congratulations! You won with ${moves} moves against ${opponentPlayerName}'s ${opponentFinalMoves} moves!`);
      } else if (moves > opponentFinalMoves) {
        setWinner(opponentPlayerName);
        alert(`${opponentPlayerName} won with ${opponentFinalMoves} moves against your ${moves} moves.`);
      } else {
        setWinner('tie');
        alert(`It's a tie! Both players finished in ${moves} moves.`);
      }
    } else {
      // Opponent finished first
      setWinner(opponentPlayerName);
      alert(`${opponentPlayerName} finished the game in ${opponentFinalMoves} moves. Keep playing to try to beat their score!`);
    }
    setGameEnded(true);
  };

  useEffect(() => {
    if (matchedPairs === cardImages.length / 2) {
      setTimeout(() => {
        if (!opponentInfo) {
          // Single player mode
          alert(`Congratulations!!! You won the game in ${moves} moves.`);
        } else if (opponentInfo.opponentMatchedPairs === cardImages.length / 2) {
          // Both players finished
          checkGameEnd(opponentInfo.opponentMoves, opponentInfo.opponentName);
        } else {
          // Player finished first, waiting for opponent
          alert(`You finished in ${moves} moves! Waiting for ${opponentInfo.opponentName} to finish...`);
          
          // Update player progress one last time
          updatePlayerProgress(moves, matchedPairs);
        }
      }, 300);
    }
  }, [matchedPairs, moves]);

  // Clean up polling interval when component unmounts
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  if (!gameStarted) {
    return (
      <div className="container">
        <div className="game-container">
          <RoomForm onCreateRoom={createRoom} onJoinRoom={joinRoom} />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="game-container">
        <GameHeader 
          playerName={playerName}
          isHost={isHost}
          opponentInfo={opponentInfo}
        />
        {roomId && (
          <div className="room-info">
            <p>Room ID: {roomId} {!opponentInfo?.opponentName && '(Waiting for opponent to join...)'}</p>
          </div>
        )}
        {gameEnded && winner && (
          <div className={`winner-banner ${winner === playerName ? 'winner' : 'loser'}`}>
            {winner === 'tie' 
              ? 'Game tied!' 
              : winner === playerName 
                ? 'You won!' 
                : `${winner} won!`}
          </div>
        )}
        <div className="cards-grid">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped={turnedCards.some((c) => c.id === card.id)}
              matched={card.matched}
            />
          ))}
        </div>
        <GameProgress moves={moves} handleRestart={shuffleCards} gameEnded={gameEnded} />
      </div>
    </div>
  );
};

export default MemoryGame;