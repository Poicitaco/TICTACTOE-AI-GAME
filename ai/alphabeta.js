// AI dùng Alpha-Beta Pruning.
// Alpha-Beta vẫn là Minimax, nhưng có thêm alpha và beta để cắt các nhánh chắc chắn không cần xét.

let alphaBetaStatesSearched = 0;
const AI_BRANCH_LIMIT = 12;

/**
 * Tìm nước đi tốt nhất cho AI bằng Alpha-Beta Pruning.
 * @param {Array<Array<string|null>>} board - Bàn cờ hiện tại.
 * @param {number} depth - Độ sâu tìm kiếm tối đa.
 * @returns {{row: number, col: number, score: number, states: number}} Nước đi tốt nhất.
 */
function findBestMoveAlphaBeta(board, depth) {
    alphaBetaStatesSearched = 0;
    let bestScore = -Infinity;
    let bestMove = null;
    let alpha = -Infinity;
    let beta = Infinity;

    const validMoves = getCandidateMoves(board, 1, AI_BRANCH_LIMIT);

    for (const move of validMoves) {
        const newBoard = board.map(row => [...row]);
        makeMove(newBoard, move.row, move.col, 'O');
        const score = alphaBeta(newBoard, depth - 1, alpha, beta, false);
        if (score > bestScore) {
            bestScore = score;
            bestMove = { row: move.row, col: move.col };
        }
        alpha = Math.max(alpha, score);
    }

    return { ...bestMove, score: bestScore, states: alphaBetaStatesSearched };
}

/**
 * Iterative deepening: chạy Alpha-Beta từ depth 1 đến depth mục tiêu.
 * Lợi ích: AI luôn có kết quả tạm thời ở depth nhỏ, sau đó cải thiện dần khi tăng depth.
 * Trong project sinh viên, hàm này dùng để minh họa "difficulty" và cách AI tìm sâu dần.
 * @param {Array<Array<string|null>>} board - Bàn cờ hiện tại.
 * @param {number} maxDepth - Độ sâu lớn nhất.
 * @returns {{row: number, col: number, score: number, states: number, depthReached: number}} Nước tốt nhất.
 */
function findBestMoveIterativeDeepening(board, maxDepth) {
    let totalStates = 0;
    let bestMove = null;

    for (let depth = 1; depth <= maxDepth; depth++) {
        const result = findBestMoveAlphaBeta(board.map(row => [...row]), depth);
        totalStates += result.states || 0;

        if (result && Number.isInteger(result.row) && Number.isInteger(result.col)) {
            bestMove = {
                ...result,
                states: totalStates,
                depthReached: depth,
            };
        }
    }

    return bestMove;
}

/**
 * Hàm đệ quy Alpha-Beta.
 * @param {Array<Array<string|null>>} board - Bàn cờ.
 * @param {number} depth - Độ sâu còn lại.
 * @param {number} alpha - Giá trị tốt nhất hiện có của nhánh max.
 * @param {number} beta - Giá trị tốt nhất hiện có của nhánh min.
 * @param {boolean} isMaximizingPlayer - true nếu đang là lượt AI.
 * @returns {number} Điểm đánh giá của trạng thái bàn cờ.
 */
function alphaBeta(board, depth, alpha, beta, isMaximizingPlayer) {
    alphaBetaStatesSearched++;

    const winner = checkWin(board, 'O') ? 'O' : checkWin(board, 'X') ? 'X' : null;
    if (winner === 'O') return WIN_SCORE;
    if (winner === 'X') return -WIN_SCORE;
    if (isBoardFull(board)) return 0;
    if (depth === 0) {
        return evaluateBoard(board);
    }

    const validMoves = getCandidateMoves(board, 1, AI_BRANCH_LIMIT);

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of validMoves) {
            const newBoard = board.map(row => [...row]);
            makeMove(newBoard, move.row, move.col, 'O');
            const evalScore = alphaBeta(newBoard, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) {
                break; // Cắt beta
            }
        }
        return maxEval;
    } else { // Người chơi là nhánh minimize
        let minEval = Infinity;
        for (const move of validMoves) {
            const newBoard = board.map(row => [...row]);
            makeMove(newBoard, move.row, move.col, 'X');
            const evalScore = alphaBeta(newBoard, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) {
                break; // Cắt alpha
            }
        }
        return minEval;
    }
}
