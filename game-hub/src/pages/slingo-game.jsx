import { useState, useEffect } from 'react';
import '../slingo-game.css';
import 'animate.css';

function SlingoGame() {
    const boardSize = 5;//def 5
    const randomNumberPool = 12;//def 12
    const freeRollPool = 2;//def 2
    const freeTilePool = 2;//def 2
    const numberOfRolls = 11;//def 11
    const bonusSlots = 1;//def 1
    



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
                const freeRollCommand = Array(freeRollPool).fill({ type: 'FREE_ROLL' });
                const freeTileCommand = Array(freeTilePool).fill({ type: 'FREE_TILE' });
                const bonusSlotCommand = Array(bonusSlots).fill({ type: 'BONUS_SLOT' });


                return [...columnValues.map((value) => ({ type: 'COLUMN', value })),
                     ...randomCommands,
                     ...freeRollCommand,
                     ...freeTileCommand,
                    ...bonusSlotCommand];
            });
    };

    const generateRandomSlots = (slotPool, initialGameLoad = false) => {
        
        return slotPool.map((pool) => {
            const randomIndex = Math.floor(Math.random() * pool.length);
            const selected = pool[randomIndex];
            if(initialGameLoad){
                return ' '
            }
            
            if (selected.type === 'RANDOM') {
                return Math.floor(Math.random() * 99) + 1;
            }
            if(selected.type === 'FREE_ROLL') {
                setRemainingRolls((prev) => prev + 1);
                return 'Free Spin';
            }
            if(selected.type === 'FREE_TILE') {
                return 'Free Tile';
            }
            if(selected.type === 'BONUS_SLOT') {
                setPlayerScore((prevScore) => prevScore + 500);
                return '500 Points!';
            }

            return selected.value;
        });
    };
    const handleClick = (row, col) => {

        if (!grid[row][col].clicked) {
            let newGrid = null;
            let bonusPoints = 0
            let pointsAdded = 0;

            if(slots[col] === 'Free Tile'){
            newGrid = grid.map((mRow, rowIndex) =>
                mRow.map((cell, colIndex) =>
                    rowIndex === row && colIndex === col ? { ...cell, clicked: true } : cell
                )
            );
            setGrid(newGrid);
            pointsAdded = grid[row][col].value;
            setPlayerScore((previousScore) => previousScore + pointsAdded);
        
            const newSlots = [...slots];
            newSlots[col] = '';
            setSlots(newSlots);
        }
        else if(grid[row][col].value === slots[col]) {
            newGrid = grid.map((mRow, rowIndex) =>
                mRow.map((cell, colIndex) =>
                    rowIndex === row && colIndex === col ? { ...cell, clicked: true } : cell
                )
            );
            setGrid(newGrid);
            pointsAdded = grid[row][col].value;
            setPlayerScore((previousScore) => previousScore + pointsAdded);


        }
        bonusPoints = checkForFiveInARow(newGrid);
        const oldScore = playerScore
        const newScore = oldScore + pointsAdded + bonusPoints
        const displayedPointAddition = newScore - oldScore;
        setPlayerScore(newScore);

        const pointAddElement = document.getElementById(`points-display`);
        
        if(pointAddElement) {
            pointAddElement.textContent = `+${displayedPointAddition}`;
            animateElement(pointAddElement, 'animate__fadeOutLeft');
        }
            setPointsDisplay(`+${displayedPointAddition}`);
            setTimeout(() => {
                setPointsDisplay(' ');
            }, 700);
            if(checkForBoardCompletion(newGrid)) {
                setGameState(false);
                setBoardCompleted(true);
                
                setTimeout(() => {
                    alert(`Congratulations! You've completed the board with a score of ${newScore}!`)
                }, 500)
            }
        }
    };
/////////////////
    function checkForFiveInARow(grid){

        let pointAddAsyncBypass = 0;
        let newFiveInARowTotal = 0;

        const countedRowsAsyncBypass = new Set(countedRows);
        const countedColumnsAsyncBypass = new Set(countedColumns);
        const countedDiagonalsAsyncBypass = new Set(countedDiagonals);

        
        for(let row=0; row < boardSize; row++) {
            if(grid[row].every(cell => cell.clicked) &&  !countedRowsAsyncBypass.has(row)) {
                pointAddAsyncBypass += 250;
                countedRowsAsyncBypass.add(row);

                newFiveInARowTotal++;

                for(let col = 0; col< boardSize; col++) {
                    const element = document.getElementById(`cell-${row}-${col}`);
                    if(element) {
                        animateElement(element, 'animate__heartBeat');
                    }

                }
            
                
            }
        }

        for(let col=0; col < boardSize; col++) {
            if(grid.every(row => row[col].clicked) && !countedColumnsAsyncBypass.has(col)) {
                pointAddAsyncBypass += 250;
                countedColumnsAsyncBypass.add(col);

                newFiveInARowTotal++;

                for(let row = 0; row< boardSize; row++) {
                    const element = document.getElementById(`cell-${row}-${col}`);
                    if(element) {
                        animateElement(element, 'animate__heartBeat');
                    }
                }
            }
        }
        if(grid.every((row, index) => row[index].clicked) && !countedDiagonalsAsyncBypass.has('leftDiagonal')) {
            pointAddAsyncBypass += 250;
            countedDiagonalsAsyncBypass.add('leftDiagonal');

            newFiveInARowTotal++;

            for(let leftDiagCount = 0; leftDiagCount< boardSize; leftDiagCount++) {
                const element = document.getElementById(`cell-${leftDiagCount}-${leftDiagCount}`);
                if(element) {
                    animateElement(element, 'animate__heartBeat');
                }
            }
        }

            if(grid.every((row, index) => row[boardSize - 1 - index].clicked) && !countedDiagonalsAsyncBypass.has('rightDiagonal')) {
                pointAddAsyncBypass += 250;
                countedDiagonalsAsyncBypass.add('rightDiagonal');

                newFiveInARowTotal++;

                for (let rightDiagCount = 0; rightDiagCount < boardSize; rightDiagCount++) {
                    const element = document.getElementById(`cell-${rightDiagCount}-${boardSize - 1 - rightDiagCount}`);
                    if (element) {
                        animateElement(element, 'animate__heartBeat');
                    }
                }
            }
            const updatedFiveInARowTotal = fiveInARowTotal + newFiveInARowTotal;
            const bonusPoints = 250 * newFiveInARowTotal;

            if(pointAddAsyncBypass > 0) {
                setFiveInARowTotal(updatedFiveInARowTotal);
                setPlayerScore((playerScore) => playerScore + pointAddAsyncBypass + bonusPoints);
                setCountedRows(countedRowsAsyncBypass);
                setCountedColumns(countedColumnsAsyncBypass);
                setCountedDiagonals(countedDiagonalsAsyncBypass);
            }

            console.log(`Bonus: ${bonusPoints}`)
            
            return bonusPoints

        }
    function checkForBoardCompletion(grid) {
        return grid.every(row => row.every(cell => cell.clicked));
    }

    function offerExtraRoll(){
            const outOfRollsPrompt = window.confirm("You have no rolls left, would you like to spend 20% of your score for an extra roll?");
            
            if(outOfRollsPrompt) {
                if(playerScore <= 10) {
                    alert("Not enough score to buy a roll.");
                    return setGameState(false);
                }
                else {
                    const pointDeduction = Math.trunc(playerScore * 0.2);

                    setPlayerScore((prevScore) => prevScore - pointDeduction);
                    setRemainingRolls((prevRolls) => prevRolls + 1);
                }
            }
            else {
                alert("Not enough rolls to continue.");
                alert(`You failed to complete the board. Your score was ${playerScore}`)
                return setGameState(false);
            }
        }



    const regenerateSlots = () => {
        if(remainingRolls > 0) {
        const newslots = generateRandomSlots(slotPool);
        setSlots(newslots);
        setRemainingRolls((prev) => prev - 1);

        newslots.forEach((_,index) => {
            const slotElement = document.getElementById(`slot-${index}`);
            if(slotElement) {
                animateElement(slotElement, 'animate__flipInX');
            }
            })
        }
        else {
            offerExtraRoll();
            }
    }
////////////
    const [gameState, setGameState] = useState(true);
    const [grid, setGrid] = useState(generateRandomGrid());
    const [slotPool, setSlotPool] = useState([]);
    const [slots, setSlots] = useState([]);
    const [playerScore, setPlayerScore] = useState(0);
    const [pointsDisplay, setPointsDisplay] = useState(' ');
    const [remainingRolls, setRemainingRolls] = useState(numberOfRolls);
    const [countedRows, setCountedRows] = useState(new Set());
    const [countedColumns, setCountedColumns] = useState(new Set());
    const [countedDiagonals, setCountedDiagonals] = useState(new Set());
    const [fiveInARowTotal, setFiveInARowTotal] = useState(0);
    const [boardCompleted, setBoardCompleted] = useState(false);
///////////
    useEffect(() => {
        const initialSlotPool = generateSlotPool(grid);
        const initialSlots = generateRandomSlots(initialSlotPool, true);
        setSlotPool(initialSlotPool);
        setSlots(initialSlots);
    }, []);

    function animateElement(element, animationName) {
        element.classList.remove("animate__animated", `${animationName}`,"animate__fast");

        void element.offsetWidth;

        element.classList.add("animate__animated", `${animationName}`,"animate__fast");
        element.addEventListener("animationend", () => {
          element.classList.remove("animate__animated", `${animationName}`,"animate__fast");
        }, { once: true });
      }
////////
    return (
        <div className="animate__animated animate__fadeInDownBig">
            <div id="score-container">
                <div id='added-score'>
                <h1>Score: {playerScore}</h1>
                {pointsDisplay && <div id="points-display" className="points-display">{pointsDisplay || ' '}</div>}
                </div>
                <div id="remaining-rolls">Remaining Rolls: {remainingRolls}</div>
            </div>
            <div id="board">
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <button
                            id={`cell-${rowIndex}-${colIndex}`}
                            key={`${rowIndex}-${colIndex}`}
                            className={`square ${cell.clicked ? 'clicked' : ''}`}
                            onClick={(e) => handleClick(rowIndex, colIndex)}
                            disabled={cell.clicked || slots[colIndex] !== 'Free Tile' && grid[rowIndex][colIndex].value !== slots[colIndex]}
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
            <button onClick={regenerateSlots} id="regenerate-slots" disabled={playerScore === 0 && !gameState || !gameState}>
                Reroll Slots
            </button>
        </div>
    );
}

export default SlingoGame