// Hàm đánh giá trạng thái cho AI.
// Điểm dương: tốt cho AI O. Điểm âm: tốt cho người X.

const WIN_SCORE = 100000;

/**
 * Evaluates the board state from the AI's perspective.
 * A higher score is better for the AI ('O'), a lower score is better for the Human ('X').
 * @param {Array<Array<string|null>>} board - The game board.
 * @returns {number} The heuristic score.
 */
function evaluateBoard(board) {
    let score = 0;
    const size = board.length;

    // Evaluate all possible lines of WIN_LENGTH
    // Horizontal
    for (let r = 0; r < size; r++) {
        for (let c = 0; c <= size - WIN_LENGTH; c++) {
            const window = [];
            for (let i = 0; i < WIN_LENGTH; i++) {
                window.push(board[r][c + i]);
            }
            score += evaluateWindow(window);
        }
    }

    // Vertical
    for (let r = 0; r <= size - WIN_LENGTH; r++) {
        for (let c = 0; c < size; c++) {
            const window = [];
            for (let i = 0; i < WIN_LENGTH; i++) {
                window.push(board[r + i][c]);
            }
            score += evaluateWindow(window);
        }
    }

    // Diagonal (down-right)
    for (let r = 0; r <= size - WIN_LENGTH; r++) {
        for (let c = 0; c <= size - WIN_LENGTH; c++) {
            const window = [];
            for (let i = 0; i < WIN_LENGTH; i++) {
                window.push(board[r + i][c + i]);
            }
            score += evaluateWindow(window);
        }
    }

    // Diagonal (down-left)
    for (let r = 0; r <= size - WIN_LENGTH; r++) {
        for (let c = WIN_LENGTH - 1; c < size; c++) {
            const window = [];
            for (let i = 0; i < WIN_LENGTH; i++) {
                window.push(board[r + i][c - i]);
            }
            score += evaluateWindow(window);
        }
    }

    return score;
}

/**
 * Evaluates a single window of 4 cells.
 * @param {Array<string|null>} window - An array of 4 cells.
 * @returns {number} The score for this window.
 */
function evaluateWindow(window) {
    let score = 0;
    const aiPieces = window.filter(p => p === 'O').length;
    const humanPieces = window.filter(p => p === 'X').length;
    const emptyCells = window.filter(p => p === null).length;

    if (aiPieces > 0 && humanPieces > 0) {
        return 0; // Mixed window is not a threat
    }

    if (aiPieces === 4) {
        score += WIN_SCORE;
    } else if (aiPieces === 3 && emptyCells === 1) {
        score += 1000;
    } else if (aiPieces === 2 && emptyCells === 2) {
        score += 100;
    } else if (aiPieces === 1 && emptyCells === 3) {
        score += 10;
    }

    if (humanPieces === 4) {
        score -= WIN_SCORE;
    } else if (humanPieces === 3 && emptyCells === 1) {
        score -= 5000; // Prioritize blocking opponent's win
    } else if (humanPieces === 2 && emptyCells === 2) {
        score -= 50;
    } else if (humanPieces === 1 && emptyCells === 3) {
        score -= 5;
    }

    return score;
}

