import { useState, useEffect } from 'react';
import './MemoryGame.css';
import reactLogo from '../assets/react.svg';

// Card data - using react.svg for all cards, pairing even/odd IDs
const cardImages = [
  { id: 1, image: reactLogo, alt: 'Card 1', matched: false },
  { id: 2, image: reactLogo, alt: 'Card 2', matched: false },
  { id: 3, image: reactLogo, alt: 'Card 3', matched: false },
  { id: 4, image: reactLogo, alt: 'Card 4', matched: false },
  { id: 5, image: reactLogo, alt: 'Card 5', matched: false },
  { id: 6, image: reactLogo, alt: 'Card 6', matched: false },
  { id: 7, image: reactLogo, alt: 'Card 7', matched: false },
  { id: 8, image: reactLogo, alt: 'Card 8', matched: false },
  { id: 9, image: reactLogo, alt: 'Card 9', matched: false },
  { id: 10, image: reactLogo, alt: 'Card 10', matched: false },
  { id: 11, image: reactLogo, alt: 'Card 11', matched: false },
  { id: 12, image: reactLogo, alt: 'Card 12', matched: false },
];

const Card = ({ card, handleChoice, flipped, disabled }) => {
  return (
    <div 
      className={`card ${flipped ? 'toggled' : ''}`} 
      onClick={() => !disabled && handleChoice(card)}
    >
      <div className="outline-image"></div>
      <img src={card.image} className="card-image" alt={card.alt} />
    </div>
  );
};

const GameHeader = ({ moves }) => {
  return (
    <div className="heading-container">
      <h1 className="gfg-heading">GeeksforGeeks</h1>
      <h2 className="game-heading">Click any card to flip it!</h2>
    </div>
  );
};

const GameProgress = ({ moves, handleRestart }) => {
  return (
    <div className="progress-container">
      <div className="move-counter">Moves: {moves}</div>
      <button className="restart-button" onClick={handleRestart}>
        Restart Game
      </button>
    </div>
  );
};

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [turnedCards, setTurnedCards] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);

  const shuffleCards = () => {
    const shuffledCards = [...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card }));

    setCards(shuffledCards);
    setTurnedCards([]);
    setDisabled(false);
    setMoves(0);
    setMatchedPairs(0);
  };

  const handleChoice = (card) => {
    if (disabled || card.matched || turnedCards.some((c) => c.id === card.id)) {
      return;
    }

    const newTurnedCards = [...turnedCards, card];
    setTurnedCards(newTurnedCards);

    if (newTurnedCards.length === 2) {
      setMoves((prevMoves) => prevMoves + 1);
      setDisabled(true);

      // Match cards with consecutive IDs (1-2, 3-4, etc.)
      const isPair = Math.abs(newTurnedCards[0].id - newTurnedCards[1].id) === 1 && 
                    Math.floor(newTurnedCards[0].id / 2) === Math.floor(newTurnedCards[1].id / 2);

      if (isPair) {
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.id === newTurnedCards[0].id || c.id === newTurnedCards[1].id
              ? { ...c, matched: true }
              : c
          )
        );
        setMatchedPairs((prev) => prev + 1);
        setTurnedCards([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setTurnedCards([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedPairs === cardImages.length / 2) {
      setTimeout(() => {
        alert(`Congratulations!!! You won the game in ${moves} moves.`);
      }, 300);
    }
  }, [matchedPairs, moves]);

  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="container">
      <div className="game-container">
        <GameHeader moves={moves} />
        <div className="cards-grid">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped={turnedCards.some((c) => c.id === card.id) || card.matched}
              disabled={disabled}
            />
          ))}
        </div>
        <GameProgress moves={moves} handleRestart={shuffleCards} />
      </div>
    </div>
  );
};

export default MemoryGame;