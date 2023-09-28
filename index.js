// Input data

const boards = require('./boards');

const drawNumbers = [
  1, 76, 38, 96, 62, 41, 27, 33, 4, 2, 94, 15, 89, 25, 66, 14, 30, 0, 71, 21,
  48, 44, 87, 73, 60, 50, 77, 45, 29, 18, 5, 99, 65, 16, 93, 95, 37, 3, 52, 32,
  46, 80, 98, 63, 92, 24, 35, 55, 12, 81, 51, 17, 70, 78, 61, 91, 54, 8, 72, 40,
  74, 68, 75, 67, 39, 64, 10, 53, 9, 31, 6, 7, 47, 42, 90, 20, 19, 36, 22, 43,
  58, 28, 79, 86, 57, 49, 83, 84, 97, 11, 85, 26, 69, 23, 59, 82, 88, 34, 56,
  13,
];

// Initialize the final score variable
let finalScore;

// Function to check if a board has a bingo in rows or columns
function hasBingo(board) {
  const numRows = board.length;
  const numCols = board[0].length;

  // Check rows for a bingo
  for (let row = 0; row < numRows; row++) {
    if (board[row].every((num) => num === -1)) {
      return true;
    }
  }

  // Check columns for a bingo
  for (let col = 0; col < numCols; col++) {
    if (board.every((row) => row[col] === -1)) {
      return true;
    }
  }

  return false;
}

// Function to create a copy of the board to track changes
function copyBoard(board) {
  return JSON.parse(JSON.stringify(board));
}

// Function to mark a drawn number as -1 on the board
function markDrawnNumber(board, draw) {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === draw) {
        board[row][col] = -1;
      }
    }
  }
}

// Function to find the round when bingo was achieved on a given board
function findBingoRound(board, drawNumbers) {
  let bingoRound = -1;
  for (let i = 0; i < drawNumbers.length; i++) {
    const draw = drawNumbers[i];
    markDrawnNumber(board, draw);

    if (hasBingo(board)) {
      bingoRound = i + 1;
      // Bingo achieved, no need to continue checking
      break; 
    }
  }
  return bingoRound;
}

// Store results for each board
const results = [];



// Loop through the boards
for (let boardIndex = 0; boardIndex < boards.length; boardIndex++) {
  const initialBoard = copyBoard(boards[boardIndex]);
  const bingoRound = findBingoRound(initialBoard, drawNumbers);

  // Store the results for this board, including the board number and bingo round
  results.push({ board: boardIndex + 1, bingoRound });
}

// Sort the results by the round when they got bingo
results.sort((a, b) => a.bingoRound - b.bingoRound);

// Check if there are results
if (results.length > 0) {
  
  // Find the last winner
  const lastWinner = results[results.length - 1];
  
  // Find the last winner board
  const winnerBoard = boards[lastWinner.board - 1];

  // Find all the drawn numbers till there was a bingo
  const drawNumbersTillBingo = drawNumbers.slice(0, lastWinner.bingoRound);

  // Find undrawn numbers on the winning board
  // Flatten this array of arrays into a single flat array
  const undrawnNumbers = winnerBoard
    .map((row) => row.filter((num) => !drawNumbersTillBingo.includes(num)))
    .flat();

  // Calculate the sum of undrawn numbers
  const sum = undrawnNumbers.reduce((acc, num) => acc + num, 0);

  // Calculate the final score and set the finalScore
  finalScore = sum * drawNumbers[lastWinner.bingoRound - 1];
} else {
  // With the hardcoded input data, this will never happen.
  console.log('No winner found.');
}



// Function to submit the answer
function submitAnswer() {
  const url = 'https://customer-api.krea.se/coding-tests/api/squid-game';
  // Store the data for the API.
  const data = JSON.stringify({
    answer: finalScore.toString(), // Convert finalScore to a string
    name: 'Cemil Ulay', // My name
  });

  // fetch (kis) instead of axios, no need for any install.
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  })
    .then((response) => {
      if (!response.ok) {
        console.log(response)
        throw new Error('Something went wrong');
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });
}

// Run node index.js to call the submitAnswer function to submit the answer to the API.
submitAnswer();