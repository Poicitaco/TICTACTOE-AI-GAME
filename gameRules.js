// Chứa luật chơi Caro.

const WIN_LENGTH = 4;

/**
 * Kiểm tra một nước đi có hợp lệ không.
 * Nước đi hợp lệ khi ô còn trống.
 * @param {Array<Array<string|null>>} board - Bàn cờ.
 * @param {number} row - Dòng cần đánh.
 * @param {number} col - Cột cần đánh.
 * @returns {boolean} true nếu hợp lệ, false nếu không hợp lệ.
 */
function isValidMove(board, row, col) {
    return board[row] && board[row][col] === null;
}

/**
 * Kiểm tra bàn cờ đã đầy chưa.
 * Nếu không còn ô null thì ván đấu hòa.
 * @param {Array<Array<string|null>>} board - Bàn cờ.
 * @returns {boolean} true nếu bàn đầy.
 */
function isBoardFull(board) {
    return board.every(row => row.every(cell => cell !== null));
}

/**
 * Kiểm tra người chơi đã thắng chưa.
 * Điều kiện thắng: có WIN_LENGTH quân liên tiếp theo ngang, dọc hoặc chéo.
 * @param {Array<Array<string|null>>} board - Bàn cờ.
 * @param {string} player - Người chơi cần kiểm tra ('X' hoặc 'O').
 * @returns {boolean} true nếu người chơi đã thắng.
 */
function checkWin(board, player) {
    const size = board.length;

    // Kiểm tra ngang, dọc và hai đường chéo.
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c] === player) {
                // Ngang
                if (c + WIN_LENGTH <= size) {
                    let won = true;
                    for (let i = 1; i < WIN_LENGTH; i++) {
                        if (board[r][c + i] !== player) {
                            won = false;
                            break;
                        }
                    }
                    if (won) return true;
                }
                // Dọc
                if (r + WIN_LENGTH <= size) {
                    let won = true;
                    for (let i = 1; i < WIN_LENGTH; i++) {
                        if (board[r + i][c] !== player) {
                            won = false;
                            break;
                        }
                    }
                    if (won) return true;
                }
                // Chéo xuống phải
                if (r + WIN_LENGTH <= size && c + WIN_LENGTH <= size) {
                    let won = true;
                    for (let i = 1; i < WIN_LENGTH; i++) {
                        if (board[r + i][c + i] !== player) {
                            won = false;
                            break;
                        }
                    }
                    if (won) return true;
                }
                // Chéo xuống trái
                if (r + WIN_LENGTH <= size && c - WIN_LENGTH + 1 >= 0) {
                    let won = true;
                    for (let i = 1; i < WIN_LENGTH; i++) {
                        if (board[r + i][c - i] !== player) {
                            won = false;
                            break;
                        }
                    }
                    if (won) return true;
                }
            }
        }
    }
    return false;
}
