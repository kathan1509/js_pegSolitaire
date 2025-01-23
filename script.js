const gameBoard = document.getElementById("game-board");
const boardSize = 7;

let board = [];
let selectedPeg = null;

function initializeBoard() {
  for (let row = 0; row < boardSize; row++) {
    board[row] = [];
    for (let col = 0; col < boardSize; col++) {
      board[row][col] = null;
    }
  }

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (
        (row < 2 && col < 2) ||
        (row < 2 && col > 4) ||
        (row > 4 && col < 2) ||
        (row > 4 && col > 4)
      ) {
        continue;
      } else {
        board[row][col] = "peg";
      }
    }
  }

  board[3][3] = null;
}

function createBoard() {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const pegHole = document.createElement("div");
      pegHole.classList.add("peg-hole");
      pegHole.id = `peg-${row}-${col}`;

      if (board[row][col] === "peg") {
        const peg = document.createElement("div");
        peg.classList.add("peg");
        pegHole.appendChild(peg);
      }

      pegHole.addEventListener("click", handleClick);
      gameBoard.appendChild(pegHole);
    }
  }
}

function handleClick(event) {
  const clickedPegHole = event.target.closest(".peg-hole");
  if (!clickedPegHole) return;

  const clickedPegHoleId = clickedPegHole.id;
  const [_, clickedRow, clickedCol] = clickedPegHoleId.split("-").map(Number);

  if (selectedPeg) {
    const [selectedRow, selectedCol] = selectedPeg;

    if (isValidMove(selectedRow, selectedCol, clickedRow, clickedCol)) {
      movePeg(selectedRow, selectedCol, clickedRow, clickedCol);

      deselectPeg(selectedRow, selectedCol);
      selectedPeg = null;
    } else {
      deselectPeg(selectedRow, selectedCol);
      selectedPeg = null;
    }
  } else {
    if (board[clickedRow][clickedCol] === "peg") {
      selectPeg(clickedRow, clickedCol);
      selectedPeg = [clickedRow, clickedCol];
    }
  }
}

function isValidMove(startRow, startCol, endRow, endCol) {
  if (board[endRow][endCol] !== null) {
    return false;
  }

  const rowDiff = Math.abs(endRow - startRow);
  const colDiff = Math.abs(endCol - startCol);

  if ((rowDiff === 2 && colDiff === 0) || (rowDiff === 0 && colDiff === 2)) {
    const jumpedRow = (startRow + endRow) / 2;
    const jumpedCol = (startCol + endCol) / 2;
    return board[jumpedRow][jumpedCol] === "peg";
  }

  return false;
}

function movePeg(startRow, startCol, endRow, endCol) {
  board[endRow][endCol] = "peg";
  board[startRow][startCol] = null;

  board[(startRow + endRow) / 2][(startCol + endCol) / 2] = null;

  updateBoardDisplay();
}

function selectPeg(row, col) {
  const pegHole = document.getElementById(`peg-${row}-${col}`);
  pegHole.classList.add("selected");
}

function deselectPeg(row, col) {
  const pegHole = document.getElementById(`peg-${row}-${col}`);
  pegHole.classList.remove("selected");
}

function updateBoardDisplay() {
  gameBoard.innerHTML = "";

  createBoard();
}

const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", () => {
  initializeBoard();
  updateBoardDisplay();
});

initializeBoard();
createBoard();
