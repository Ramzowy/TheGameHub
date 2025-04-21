
import React, { useState, useEffect } from 'react';
import './Wordle.css';

// 1. Smallest, most basic components first
const LetterTile = ({ letter, status }) => (
  <div className={`letter ${status}`}>
    {letter}
  </div>
);

const WordRow = ({ letters }) => (
  <div className="grid-row">
    {letters.map((cell, index) => (
      <LetterTile 
        key={index}
        letter={typeof cell === 'object' ? cell.letter : cell}
        status={typeof cell === 'object' ? cell.status : ''}
      />
    ))}
  </div>
);

const WordGrid = ({ grid }) => (
  <div id="wordle-grid">
    {grid.map((row, rowIndex) => (
      <WordRow key={rowIndex} letters={row} />
    ))}
  </div>
);

const GameHeader = ({ darkMode, toggleDarkMode }) => (
  <header>
    <h1>Wordle</h1>
    <button id="mode-toggle" onClick={toggleDarkMode}>
      {darkMode ? '🌞' : '🌙'}
    </button>
  </header>
);

// 2. Game logic and state management
const useWordleGame = () => {
  const [gameState, setGameState] = useState({
    targetWord: '',
    currentAttempt: 0,
    currentPositions: 0,
    grid: Array(6).fill().map(() => Array(5).fill(''))
  });

  const gameConfig = {
    attempts: 6,
    wordLength: 5
  };

  const getRandomWord = async () => {
    try {
      const response = await fetch(
        `https://random-word-api.herokuapp.com/word?length=${gameConfig.wordLength}`
      );
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error("Error fetching random word:", error);
      return "hello"; // Fallback word
    }
  };

  const initializeGame = async () => {
    const word = await getRandomWord();
    setGameState({
      targetWord: word,
      currentAttempt: 0,
      currentPositions: 0,
      grid: Array(6).fill().map(() => Array(5).fill(''))
    });
  };

  const isWordValid = async (word) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`
      );
      return response.ok;
    } catch (error) {
      console.error(`Error checking if word is valid: ${error}`);
      return false;
    }
  };

  const checkWordLetters = (word) => {
    const letters = word.split("");
    const targetLetters = gameState.targetWord.split("");

    return letters.map((letter, index) => {
      if (letter.toLowerCase() === targetLetters[index]?.toLowerCase()) {
        return `correct`;
      }
      if (targetLetters.includes(letter.toLowerCase())) {
        return `misplaced`;
      }
      return `incorrect`;
    });
  };

  const revealGuess = (results) => {
    const newGrid = [...gameState.grid];
    const rowToReveal = gameState.currentAttempt;
    
    results.forEach((result, index) => {
      newGrid[rowToReveal][index] = {
        letter: newGrid[rowToReveal][index],
        status: result
      };
    });
    
    setGameState(prev => ({
      ...prev,
      grid: newGrid
    }));
  };

  const submitGuess = async () => {
    if (gameState.currentPositions < gameConfig.wordLength) return;
    
    const currentWord = gameState.grid[gameState.currentAttempt].join("");
    if (!(await isWordValid(currentWord))) {
      alert("Invalid word!");
      return;
    }

    const result = checkWordLetters(currentWord);
    revealGuess(result);

    if (currentWord.toLowerCase() === gameState.targetWord.toLowerCase()) {
      alert("You won!");
      setTimeout(initializeGame, 2000);
    } else if (gameState.currentAttempt + 1 >= gameConfig.attempts) {
      alert(`Game over! The word was ${gameState.targetWord}`);
      setTimeout(initializeGame, 2000);
    } else {
      setGameState(prev => ({
        ...prev,
        currentAttempt: prev.currentAttempt + 1,
        currentPositions: 0
      }));
    }
  };

  const addLetter = (letter) => {
    if (gameState.currentPositions < gameConfig.wordLength) {
      const newGrid = [...gameState.grid];
      newGrid[gameState.currentAttempt][gameState.currentPositions] = letter;
      
      setGameState(prev => ({
        ...prev,
        grid: newGrid,
        currentPositions: prev.currentPositions + 1
      }));
    }
  };

  const removeLetter = () => {
    if (gameState.currentPositions > 0) {
      const newGrid = [...gameState.grid];
      newGrid[gameState.currentAttempt][gameState.currentPositions - 1] = "";
      
      setGameState(prev => ({
        ...prev,
        grid: newGrid,
        currentPositions: prev.currentPositions - 1
      }));
    }
  };

  return {
    gameState,
    initializeGame,
    addLetter,
    removeLetter,
    submitGuess
  };
};

// 3. Main game component that brings everything together
const WordleGame = () => {
  const [darkMode, setDarkMode] = useState(true);
  const {
    gameState,
    initializeGame,
    addLetter,
    removeLetter,
    submitGuess
  } = useWordleGame();

  useEffect(() => {
    initializeGame();
  }, []);

  const handleKeyDown = (e) => {
    const key = e.key;
    if (/^[a-z]$/i.test(key)) {
      addLetter(key.toUpperCase());
    } else if (key === "Backspace") {
      removeLetter();
    } else if (key === "Enter") {
      submitGuess();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`app ${darkMode ? '' : 'light-mode'}`}>
      <GameHeader darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div id="game">
        <WordGrid grid={gameState.grid} />
      </div>
    </div>
  );
};

export default WordleGame;
