// Constants for board size and piece colors
const ROWS = 8;
const COLS = 8;
const RED = 'red';
const GREEN = 'green';

// Game variables
let board = [];
let selectedPiece = null;
let turn = RED; // Starting turn for red player

// Initialize the game board
function initBoard() {
    for (let row = 0; row < ROWS; row++) {
        board[row] = [];
        for (let col = 0; col < COLS; col++) {
            let color = '';
            if ((row + col) % 2 === 1) {
                if (row < 3) color = GREEN;
                if (row > 4) color = RED;
            }
            board[row][col] = { color, king: false };
            renderSquare(row, col, color);
        }
    }
}

// Render individual square on the board
function renderSquare(row, col, color) {
    const square = document.createElement('div');
    square.className = 'square';
    square.className += (row + col) % 2 === 0 ? ' light' : ' dark';
    square.dataset.row = row;
    square.dataset.col = col;

    if (color) {
        const piece = document.createElement('div');
        piece.className = `piece piece-${color}`;
        square.appendChild(piece);
    }

    square.addEventListener('click', () => handleSquareClick(row, col));
    document.getElementById('board').appendChild(square);
}

// Handle click on a square
function handleSquareClick(row, col) {
    if (selectedPiece) {
        movePiece(selectedPiece.row, selectedPiece.col, row, col);
    } else if (board[row][col].color === turn) {
        selectedPiece = { row, col };
    }
}

// Move a piece to a new location
function movePiece(fromRow, fromCol, toRow, toCol) {
    if (isValidMove(fromRow, fromCol, toRow, toCol)) {
        // Capture opponent's piece if jumping
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;
        if (Math.abs(fromRow - toRow) === 2) {
            board[midRow][midCol] = { color: '', king: false };
        }

        // Move the piece
        board[toRow][toCol] = board[fromRow][fromCol];
        board[fromRow][fromCol] = { color: '', king: false };

        // Render the new state of the board
        document.getElementById('board').innerHTML = '';
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                renderSquare(row, col, board[row][col].color);
            }
        }

        // Check if the game is over
        if (isGameOver()) {
            document.getElementById('message').innerText = `${turn.charAt(0).toUpperCase() + turn.slice(1)} wins!`;
        } else {
            // Change the turn
            turn = turn === RED ? GREEN : RED;
            document.getElementById('message').innerText = `${turn.charAt(0).toUpperCase() + turn.slice(1)}'s Turn`;
            selectedPiece = null;
        }
    }
}

// Check if a move is valid
function isValidMove(fromRow, fromCol, toRow, toCol) {
    // Ensure the destination is within bounds and is a dark square
    if (toRow < 0 || toRow >= ROWS || toCol < 0 || toCol >= COLS || (toRow + toCol) % 2 === 0) {
        return false;
    }

    // Ensure the destination square is empty
    if (board[toRow][toCol].color !== '') {
        return false;
    }

    // Check for valid move distance
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    if (rowDiff === 1 && colDiff === 1) {
        return true;
    }

    // Check for valid jump over an opponent piece
    if (rowDiff === 2 && colDiff === 2) {
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;
        if (board[midRow][midCol].color !== '' && board[midRow][midCol].color !== turn) {
            return true;
        }
    }

    return false;
}

// Check if the game is over
function isGameOver() {
    let redPieces = 0;
    let greenPieces = 0;
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col].color === RED) {
                redPieces++;
            } else if (board[row][col].color === GREEN) {
                greenPieces++;
            }
        }
    }
    return redPieces === 0 || greenPieces === 0;
}

// Reset the game
function resetGame() {
    board = [];
    document.getElementById('board').innerHTML = '';
    initBoard();
    turn = RED;
    document.getElementById('message').innerText = "Red's Turn";
}

// Initialize the game when the page loads
window.onload = () => {
    initBoard();
};
