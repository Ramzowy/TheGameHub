import { useState, useEffect } from 'react';
import '../slingo-game.css';
import 'animate.css';

function SlingoGame() {
    const boardSize = 5;
    const randomNumberPool = 8;
    const numberOfRolls = 10;



    const generateRandomGrid = () =>
        Array(boardSize)
            .fill()
            .map(() =>
                Array(boardSize)
                    .fill()
                    .map(() => ({ value: Math.floor(Math.random() * 99) + 1, clicked: false }))
            );

    const generateSlotPool = (grid) => {
        return Array(boardSize)
            .fill()
            .map((_, colIndex) => {
                const columnValues = grid.map((row) => row[colIndex].value);
                const randomCommands = Array(randomNumberPool).fill({ type: 'RANDOM' });
                return [...columnValues.map((value) => ({ type: 'COLUMN', value })), ...randomCommands];
            });
    };

    const generateRandomSlots = (slotPool) => {
        return slotPool.map((pool) => {
            const randomIndex = Math.floor(Math.random() * pool.length);
            const selected = pool[randomIndex];
            if (selected.type === 'RANDOM') {
                return Math.floor(Math.random() * 99) + 1;
            }
            return selected.value;
        });
    };
    const handleClick = (row, col) => {
        if (!grid[row][col].clicked && grid[row][col].value === slots[col]) {
            const newGrid = grid.map((mRow, rowIndex) =>
                mRow.map((cell, colIndex) =>
                    rowIndex === row && colIndex === col ? { ...cell, clicked: true } : cell
                )
            );
            setGrid(newGrid);
            setPlayerScore((previousScore) => previousScore + grid[row][col].value);
        }
    };

    const regenerateSlots = () => {
        const newslots = generateRandomSlots(slotPool);
        setSlots(newslots);

        newslots.forEach((_,index) => {
            const slotElement = document.getElementById(`slot-${index}`);
            if(slotElement) {
                animateElement(slotElement, 'animate__flipInX');
            }
        })
    };

    const [grid, setGrid] = useState(generateRandomGrid());
    const [slotPool, setSlotPool] = useState([]);
    const [slots, setSlots] = useState([]);
    const [playerScore, setPlayerScore] = useState(0);

    useEffect(() => {
        const initialSlotPool = generateSlotPool(grid);
        const initialSlots = generateRandomSlots(initialSlotPool);
        setSlotPool(initialSlotPool);
        setSlots(initialSlots);
    }, []);

    function animateElement(element, animationName) {
        element.classList.add("animate__animated", `${animationName}`,"animate__fast");
        element.addEventListener("animationend", () => {
          element.classList.remove("animate__animated", `${animationName}`,"animate__fast");
        });
      }

    return (
        <div className="animate__animated animate__fadeInDownBig">
            <div id="score-container">
                <h1>Score: {playerScore}</h1>
            </div>
            <div id="board">
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <button
                            key={`${rowIndex}-${colIndex}`}
                            className={`square ${cell.clicked ? 'clicked' : ''}`}
                            onClick={(e) => handleClick(rowIndex, colIndex)}
                            disabled={cell.clicked || grid[rowIndex][colIndex].value !== slots[colIndex]}
                        >
                            {cell.value}
                        </button>
                    ))
                )}
            </div>
            <div id="slots">
                {slots.map((slotValue, index) => (
                    <div key={index} id={`slot-${index}`} className="slot">
                        {slotValue}
                    </div>
                ))}
            </div>
            <button onClick={regenerateSlots} id="regenerate-slots">
                Reroll Slots
            </button>
        </div>
    );
}

export default SlingoGame;