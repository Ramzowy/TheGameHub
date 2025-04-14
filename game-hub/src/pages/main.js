const wordleGrid = document.getElementById("wordle-grid");

const gameState = {
  targetWord: "Hello",
  currentAttempt: 0,
  currentPosition: 0,
  grid: [[], [], [], [], [], []],
};

const gameConfig = {
  attempts: 6,
  wordLength: 5,
};

async function initializeGame() {
  gameState.targetWord = await getRandomWord();
  initializeGrid();
}

initializeGame();

async function getRandomWord() {
  const response = await fetch(
    `https://random-word-api.vercel.app/api?words=1&length=${gameConfig.wordLength}`
  );
  const data = await response.json();
  console.log(data[0]);
  return data[0];
}

function initializeGrid() {
  for (let row = 0; row < gameConfig.attempts; row++) {
    gameState.grid[row] = [];
    for (let column = 0; column < gameConfig.wordLength; column++) {
      addLetterBoxToGrid(row, column);
    }
  }
}

function addLetterBoxToGrid(row, column) {
  const letterBox = document.createElement("div");
  letterBox.classList.add("letter");
  letterBox.id = `cell-${row}-${column}`;
  wordleGrid.appendChild(letterBox);
}

document.addEventListener("keydown", (event) => {
  const userInput = event.key;

  if (isLetter(userInput)) {
    addLetterToGrid(userInput);
  }
  if (isBackspace(userInput)) {
    removeLetterFromGrid();
  }
  if (isEnter(userInput)) {
    submitGuess();
  }
  if (isResetKey(event.code)) {
    location.reload();
  }
});

function isLetter(input) {
  return input.length === 1 && input.match(/[a-z]/i);
}

function isBackspace(input) {
  return input === "Backspace";
}

function isEnter(input) {
  return input === "Enter";
}
function isResetKey(input) {
  return input === "ShiftRight";
}

function addLetterToGrid(letter) {
  if (gameState.currentPosition < gameConfig.wordLength) {
    gameState.grid[gameState.currentAttempt][gameState.currentPosition] =
      letter;

    updateCell(gameState.currentAttempt, gameState.currentPosition);
    gameState.currentPosition++;
  }
}

function removeLetterFromGrid() {
  if (gameState.currentPosition > 0) {
    gameState.currentPosition--;
    gameState.grid[gameState.currentAttempt][gameState.currentPosition] = "";
    updateCell(gameState.currentAttempt, gameState.currentPosition);
  }
}

function updateCell(row, column) {
  const cell = document.getElementById(`cell-${row}-${column}`);
  cell.textContent = gameState.grid[row][column];

  animateElement(cell, "animate__bounceIn");
}

async function submitGuess() {
  if (gameState.currentPosition < gameConfig.wordLength) {
    shakeRow(gameState.currentAttempt);
    return;
  }
  const currentWord = gameState.grid[gameState.currentAttempt].join("");

  if (!(await isWordValid(currentWord))) {
    console.log("invalid word");
    shakeRow(gameState.currentAttempt);
    return;
  }
  const results = checkWordLetters(currentWord);
  revealGuess(results);

  if (currentWord.toLowerCase() === gameState.targetWord.toLocaleLowerCase()) {
    addWinText();
    console.log("youwon");
  } else {
    gameState.currentAttempt++;
    gameState.currentPosition = 0;
    if (gameState.currentAttempt >= gameConfig.attempts) {
      addLoseText();
      console.log("youlose");
    }
  }
}

async function isWordValid(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
    );
    return response.ok;
  } catch (error) {
    console.error(`error checking ${error}`);
    return false;
  }
}

function checkWordLetters(word) {
  const letters = word.split("");
  const targetLetters = gameState.targetWord.split("");

  const results = letters.map((letter, index) => {
    if (letter === targetLetters[index]) {
      return "correct";
    }
    if (targetLetters.includes(letter)) {
      return "misplaced";
    }
    return "incorrect";
  });
  return results;
}

function revealGuess(results) {
  const rowToReveal = gameState.currentAttempt;
  results.forEach((result, index) => {
    const cell = document.getElementById(`cell-${rowToReveal}-${index}`);
    cell.classList.add(result);

    flipCells(rowToReveal);
  });
}

function shakeRow(row) {
  const wordLength = gameConfig.wordLength;

  for (let col = 0; col < wordLength; col++) {
    const cell = document.getElementById(`cell-${row}-${col}`);

    animateElement(cell, "animate__shakeX");
  }
}
function flipCells(row) {
  const wordLength = gameConfig.wordLength;

  for (let col = 0; col < wordLength; col++) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    setTimeout(() => {
      animateElement(cell, "animate__flipInX");
    }, 350 * col);
  }
}

function animateElement(element, animationName) {
  element.classList.add("animate__animated", `${animationName}`);
  element.addEventListener("animationend", () => {
    element.classList.remove("animate__animated", `${animationName}`);
  });
}

function addWinText() {
  const postGameTextContainer = document.createElement("div");
  postGameTextContainer.id = "post-game-text";
  postGameTextContainer.classList.add("animate__animated", "animate__fadeIn");

  const winTextPart1 = document.createTextNode(
    `You guessed the word in ${gameState.currentAttempt + 1} attempts.`
  );
  const lineBreak = document.createElement("br");
  const winTextPart2 = document.createTextNode(
    `Use Right Shift to play again.`
  );

  postGameTextContainer.appendChild(winTextPart1);
  postGameTextContainer.appendChild(lineBreak);
  postGameTextContainer.appendChild(winTextPart2);

  document.body.appendChild(postGameTextContainer);
}

function addLoseText() {
  const postGameTextContainer = document.createElement("div");
  postGameTextContainer.id = "post-game-text";
  postGameTextContainer.classList.add("animate__animated", "animate__fadeIn");

  const loseTextPart1 = document.createTextNode(
    `You did not guess the word. The word was ${gameState.targetWord}.`
  );
  const lineBreak = document.createElement("br");
  const loseTextPart2 = document.createTextNode(
    `Use Right Shift to try again.`
  );

  postGameTextContainer.appendChild(loseTextPart1);
  postGameTextContainer.appendChild(lineBreak);
  postGameTextContainer.appendChild(loseTextPart2);

  document.body.appendChild(postGameTextContainer);
}
