// Quản lý bàn cờ Caro.
// Sinh viên cần nắm: board là mảng 2 chiều, mỗi ô có thể là 'X', 'O' hoặc null.

/**
 * Creates an empty board of a given size.
 * @param {number} size - The width and height of the board.
 * @returns {Array<Array<string|null>>} A 2D array representing the board.
 */
function createBoard(size) {
    return Array(size).fill(null).map(() => Array(size).fill(null));
}

/**
 * Đặt quân lên bàn cờ.
 * @param {Array<Array<string|null>>} board - Bàn cờ.
 * @param {number} row - Dòng cần đánh.
 * @param {number} col - Cột cần đánh.
 * @param {string} player - Người đánh ('X' hoặc 'O').
 */
function makeMove(board, row, col, player) {
    if (board[row][col] === null) {
        board[row][col] = player;
    }
}

/**
 * Tạo danh sách toàn bộ nước đi hợp lệ.
 * @param {Array<Array<string|null>>} board - Bàn cờ.
 * @returns {Array<{row: number, col: number}>} Danh sách nước đi hợp lệ.
 */
function getValidMoves(board) {
    const moves = [];
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (board[r][c] === null) {
                moves.push({ row: r, col: c });
            }
        }
    }
    return moves;
}

/**
 * Tạo danh sách nước đi ứng viên gần các quân đã có.
 * Nếu xét mọi ô trống thì AI rất dễ bị chậm. Trong Caro, nước đi tốt thường
 * nằm gần khu vực đang giao tranh, nên ta chỉ xét quanh các quân hiện có.
 * @param {Array<Array<string|null>>} board - Bàn cờ.
 * @param {number} radius - Khoảng cách cần xét quanh quân đã có.
 * @param {number} limit - Số nước tối đa trả về.
 * @returns {Array<{row: number, col: number}>} Danh sách nước đi đã sắp xếp.
 */
function getCandidateMoves(board, radius = 1, limit = 18) {
    const size = board.length;
    const occupied = [];
    const candidates = new Map();

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c] !== null) {
                occupied.push({ row: r, col: c });
            }
        }
    }

    if (occupied.length === 0) {
        const center = Math.floor(size / 2);
        return [{ row: center, col: center }];
    }

    for (const stone of occupied) {
        for (let dr = -radius; dr <= radius; dr++) {
            for (let dc = -radius; dc <= radius; dc++) {
                if (dr === 0 && dc === 0) continue;

                const row = stone.row + dr;
                const col = stone.col + dc;

                if (row >= 0 && row < size && col >= 0 && col < size && board[row][col] === null) {
                    candidates.set(`${row},${col}`, { row, col });
                }
            }
        }
    }

    return orderMoves(board, [...candidates.values()]).slice(0, limit);
}

/**
 * Sắp xếp nước đi (move ordering).
 * Ý tưởng: thử trước các ô gần chuỗi quân đang có và gần trung tâm.
 * Alpha-Beta sẽ cắt tỉa tốt hơn nếu các nước mạnh được xét trước.
 * @param {Array<Array<string|null>>} board - Bàn cờ hiện tại.
 * @param {Array<{row: number, col: number}>} moves - Danh sách nước đi.
 * @returns {Array<{row: number, col: number}>} Danh sách đã sắp xếp.
 */
function orderMoves(board, moves) {
    const center = (board.length - 1) / 2;
    return [...moves].sort((a, b) => {
        const scoreA = scoreCandidate(board, a.row, a.col) - distanceFromCenter(a, center);
        const scoreB = scoreCandidate(board, b.row, b.col) - distanceFromCenter(b, center);
        return scoreB - scoreA;
    });
}

function scoreCandidate(board, row, col) {
    let score = 0;
    const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
    ];

    for (const [dr, dc] of directions) {
        score += countLine(board, row, col, dr, dc, 'O') * 12;
        score += countLine(board, row, col, dr, dc, 'X') * 16;
    }

    return score;
}

function countLine(board, row, col, dr, dc, player) {
    return countDirection(board, row, col, dr, dc, player)
        + countDirection(board, row, col, -dr, -dc, player);
}

function countDirection(board, row, col, dr, dc, player) {
    let count = 0;
    let r = row + dr;
    let c = col + dc;

    while (board[r] && board[r][c] === player) {
        count++;
        r += dr;
        c += dc;
    }

    return count;
}

function distanceFromCenter(move, center) {
    return Math.abs(move.row - center) + Math.abs(move.col - center);
}
