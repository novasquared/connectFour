"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *  board = array of rows, each row contains an array of cells
 *  the bottom row is the 0 row and the left column is the 0 column 
 * (board[y][x])
 */
function makeBoard() {
  let rowArray = [];

  for (let x = 0; x < WIDTH; x++) {
    rowArray.push(null);
  }

  for (let y = 0; y < HEIGHT; y++) {
    board.push([...rowArray]);
  }
}

/** makeHtmlBoard: creates an empty HTML table with a clickable row at the top
  * to allow players to click above the column they want to drop a piece in. 
*/
function makeHtmlBoard() {
  const htmlBoard = document.getElementById('board');

  // Create an empty row at the top and add an event listener to the row.
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // create cells for the top row with an id equal to the column number.
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }

  // append the top row at the top of the table.
  htmlBoard.append(top);

  // create the rows in the html table
  for (let y = HEIGHT - 1; y > -1; y--) {
    let row = document.createElement("tr");

    // create cells within each row and create an id
    // with the y and x elements like y-x.
    // Append each cell to the row.
    for (let x = 0; x < WIDTH; x++) {
      let cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`)

      row.append(cell);

    }

    // append each row to the html table
    htmlBoard.append(row);
  }
}

/** 
 * findSpotForCol: given column x, return the first empty y coordinate 
 * starting from 0.  Return null if all are full.
*/
function findSpotForCol(x) {
  for (let y = 0; y < HEIGHT; y++) {
    if (board[y][x] === null) {
      return y
    }
  }
  return null;
}

/** 
 * placeInTable: update DOM to place piece into HTML table of board 
 * at the correct coordinate
*/
function placeInTable(y, x) {
  const currentCell = document.getElementById(`${y}-${x}`);
  const piece = document.createElement("div");
  piece.classList.add(`p${currPlayer}`);
  piece.classList.add("piece");
  currentCell.appendChild(piece);
}

/** endGame: announce game end */
function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id; //
  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;

  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (isBoardFilled(board)) {
    endGame('You have tied!');
  }

  // switch players
  currPlayer = (currPlayer === 1) ? 2 : 1; //
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function isBoardFilled(board) {
  return board.every(x => x.every(y => y !== null)); //clearer names for x & y
}

function checkForWin() {
  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {
    // Check four cells to see if they're all legal & all color of current player
    // Returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // using HEIGHT and WIDTH, check all cells and generate a "check list" 
  // of coordinates for 4 cells and each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDL = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDR = [[y, x], [y - 1, x - 1], [y - 2, x - 2], [y - 3, x - 3]];

      // check for any type of win
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
