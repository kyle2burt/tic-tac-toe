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

const Players = (function() {
    const players = [
        {
            name: 'Player 1',
            token: 1,
        },
        {
            name: 'Player 2',
            token: 2,
        }
    ];

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const setName = (player, name) => {
        players[player].name = name;
    }

    return { getActivePlayer, switchPlayerTurn, setName}
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

    const startButton = document.querySelector('#start');
    startButton.addEventListener('click', (event) => {
        event.preventDefault();

        const startModal = document.querySelector('#start-menu');
        const form = document.querySelector('#start-form');
        const formData = new FormData(form);

        if (formData.get('player1-name') != '') Players.setName(0, formData.get('player1-name'));
        if (formData.get('player1-name') != '') Players.setName(1, formData.get('player2-name'));

        startModal.close();
    });
})();