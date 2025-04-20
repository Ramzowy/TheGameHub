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

const GameHeader = ({ moves }) => {
  return (
    <div className="heading-container">
      <h1 className="gfg-heading">Earl-Rahim</h1>
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
      .map((card) => ({ ...card, matched: false }));

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
  
      const isPair = newTurnedCards[0].pairId === newTurnedCards[1].pairId;
  
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
          setMatchedPairs((prev) => prev + 1);
          setTurnedCards([]);
          setDisabled(false);
        }, 1000);
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
              flipped={turnedCards.some((c) => c.id === card.id)}
              matched={card.matched}
            />
          ))}
        </div>
        <GameProgress moves={moves} handleRestart={shuffleCards} />
      </div>
    </div>
  );
};

export default MemoryGame;