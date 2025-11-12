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

    const placeToken = (row, col, player) => {
        board[row][col] = player;
    }

    return { getBoard, placeToken };
})();