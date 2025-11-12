const Gameboard = (function() {
    const rows = 3;
    const cols = 3;
    const board = [];

    // Create empty board
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i].push(0);
        }
    }

    const getBoard = () => board;

    const placeToken = (row, col) => {
        board[row][col] = Players.getActivePlayer().token;
    }

    return { getBoard, placeToken };
})();

const Players = (function(playerOne = 'Player 1', playerTwo = 'Player 2') {
    const players = [
        {
            name: playerOne,
            token: 1,
        },
        {
            name: playerTwo,
            token: 2,
        }
    ];

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    return { getActivePlayer, switchPlayerTurn}
})();

const Gameflow = (function() {
    const playRound = (row, col) => {
        Gameboard.placeToken(row, col);
        console.table(Gameboard.getBoard());
        Render.drawBoard();
        if (checkWin()) console.log(`${Players.getActivePlayer().name} Wins!`);
        else if (checkDraw()) console.log('Draw!');
        Players.switchPlayerTurn();
    }

    const checkWin = () => {
        const board = Gameboard.getBoard();
        const activeToken = Players.getActivePlayer().token;

        for (i = 0; i < board.length; i++) {
            let row = 0;
            let col = 0;
            let rightDiag = 0;
            let leftDiag = 0;

            let reducer = board.length - 1;
            for (j = 0; j < board.length; j++) {
                if (board[i][j] === activeToken) row++;
                if (board[j][i] === activeToken) col++;
                if (board[j][j] === activeToken) rightDiag++; 
                if (board[j][reducer] === activeToken) leftDiag++;
                reducer--;
            }
            if (row === board.length || col === board.length || rightDiag === board.length || leftDiag === board.length) return true;
        }
        return false
    }

    const checkDraw = () => {
        const board = Gameboard.getBoard();
        if (!board.flat().filter((value) => value === 0)) return true;
    }

    return { playRound };
})();

const Render = (function() {
    const pageBoard = document.querySelector("#game-board");

    const clearPage = () => {
        while(pageBoard.lastChild) {
            pageBoard.removeChild(pageBoard.lastChild);
        }
    }

    const drawBoard = () => {
        clearPage();

        const board = Gameboard.getBoard();
        const boardSize = board.length * board.length;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;

                if (board[i][j] === 1) cell.textContent = 'X';
                else if (board[i][j] === 2) cell.textContent = 'O';

                pageBoard.appendChild(cell);
            }
        }
    }

    drawBoard();

    return { drawBoard }
})();

const Events = (function() {
    const pageBoard = document.querySelector('#game-board');

    pageBoard.addEventListener(('click'), (event) => {
        const row = event.target.dataset.row;
        const col = event.target.dataset.col;

        if (Gameboard.getBoard()[row][col] === 0) {
            Gameflow.playRound(row, col);
        }
    });
})();