// AI dùng thuật toán Minimax.
// Minimax giả lập lượt đi của AI (max) và người chơi (min) đến một độ sâu giới hạn.

let minimaxStatesSearched = 0;
const MINIMAX_BRANCH_LIMIT = 12;


/**
 * Tìm nước đi tốt nhất cho AI bằng Minimax.
 * @param {Array<Array<string|null>>} board - Bàn cờ hiện tại.
 * @param {number} depth - Độ sâu tìm kiếm tối đa.
 * @returns {{row: number, col: number, score: number, states: number}} Nước đi tốt nhất.
 */
function findBestMoveMinimax(board, depth) {
    minimaxStatesSearched = 0;
    let bestScore = -Infinity;
    let danhSachNuocTot = []; // Thu thap tat ca nuoc co diem bang nhau

    const validMoves = getCandidateMoves(board, 1, MINIMAX_BRANCH_LIMIT);

    for (const move of validMoves) {
        const newBoard = board.map(row => [...row]);
        makeMove(newBoard, move.row, move.col, 'O');
        const score = minimax(newBoard, depth - 1, false);
        if (score > bestScore) {
            bestScore = score;
            danhSachNuocTot = [{ row: move.row, col: move.col }];
        } else if (score === bestScore) {
            danhSachNuocTot.push({ row: move.row, col: move.col });
        }
    }

    // Chon ngau nhien trong cac nuoc co diem bang nhau de tao su da dang
    const nuocChon = danhSachNuocTot[Math.floor(Math.random() * danhSachNuocTot.length)];
    return { ...nuocChon, score: bestScore, states: minimaxStatesSearched };
}


/**
 * Hàm đệ quy Minimax.
 * @param {Array<Array<string|null>>} board - Bàn cờ.
 * @param {number} depth - Độ sâu còn lại.
 * @param {boolean} isMaximizingPlayer - true nếu đang là lượt AI.
 * @returns {number} Điểm đánh giá của trạng thái bàn cờ.
 */
function minimax(board, depth, isMaximizingPlayer) {
    minimaxStatesSearched++;

    const winner = checkWin(board, 'O') ? 'O' : checkWin(board, 'X') ? 'X' : null;
    if (winner === 'O') return WIN_SCORE;
    if (winner === 'X') return -WIN_SCORE;
    if (isBoardFull(board)) return 0;
    if (depth === 0) {
        return evaluateBoard(board);
    }

    const validMoves = getCandidateMoves(board, 1, MINIMAX_BRANCH_LIMIT);

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of validMoves) {
            const newBoard = board.map(row => [...row]);
            makeMove(newBoard, move.row, move.col, 'O');
            const evalScore = minimax(newBoard, depth - 1, false);
            maxEval = Math.max(maxEval, evalScore);
        }
        return maxEval;
    } else { // Người chơi là nhánh minimize
        let minEval = Infinity;
        for (const move of validMoves) {
            const newBoard = board.map(row => [...row]);
            makeMove(newBoard, move.row, move.col, 'X');
            const evalScore = minimax(newBoard, depth - 1, true);
            minEval = Math.min(minEval, evalScore);
        }
        return minEval;
    }
}
