// Benchmark dùng để so sánh Minimax và Alpha-Beta trên cùng test case, cùng depth.
// Mục tiêu: chứng minh Alpha-Beta giảm số node và runtime nhưng vẫn giữ chất lượng nước đi.

const BENCHMARK_DEPTHS = [1, 2, 3];

/**
 * Chạy benchmark cho một trạng thái bàn cờ.
 * @param {object} testCase - Test case trong testCases.js.
 * @returns {Array<object>} Các dòng kết quả benchmark.
 */
function runBenchmark(testCase, depths = BENCHMARK_DEPTHS) {
    const rows = [];

    for (const depth of depths) {
        const minimax = timeAlgorithm(() => findBestMoveMinimax(cloneBoard(testCase.board), depth));
        const alphabeta = timeAlgorithm(() => findBestMoveAlphaBeta(cloneBoard(testCase.board), depth));
        const sameMove = sameMoveResult(minimax.result, alphabeta.result);
        const reduction = getReductionPercent(minimax.result.states, alphabeta.result.states);

        rows.push({
            caseName: testCase.name,
            description: testCase.description,
            depth,
            minimax,
            alphabeta,
            sameMove,
            reduction,
            quality: describeMoveQuality(testCase, minimax.result, alphabeta.result, sameMove),
        });
    }

    return rows;
}

/**
 * Chạy tất cả test case bắt buộc.
 * @returns {Array<object>} Bảng benchmark đầy đủ.
 */
function runAllBenchmarks(depths = BENCHMARK_DEPTHS) {
    return testCases.flatMap((testCase) => runBenchmark(testCase, depths));
}

function timeAlgorithm(callback) {
    const start = performance.now();
    const result = callback();
    return {
        result,
        time: performance.now() - start,
    };
}

function cloneBoard(source) {
    return source.map((row) => [...row]);
}

function sameMoveResult(a, b) {
    return a && b && a.row === b.row && a.col === b.col;
}

function getReductionPercent(minimaxStates, alphaBetaStates) {
    if (!Number.isFinite(minimaxStates) || minimaxStates <= 0) return 0;
    return Math.max(0, 100 - (alphaBetaStates / minimaxStates) * 100);
}

function describeMoveQuality(testCase, minimaxMove, alphaBetaMove, sameMove) {
    const expected = testCase.expectedMoves || [];
    const alphaGood = expected.some((move) => move.row === alphaBetaMove.row && move.col === alphaBetaMove.col);
    const miniGood = expected.some((move) => move.row === minimaxMove.row && move.col === minimaxMove.col);

    if (expected.length === 0) {
        return sameMove ? 'Cùng chọn một nước hợp lý' : 'Khác nước, cần xem score';
    }

    if (alphaGood && miniGood) return 'Đạt nước kỳ vọng';
    if (alphaGood) return 'Alpha-Beta đạt nước kỳ vọng';
    if (miniGood) return 'Minimax đạt nước kỳ vọng';
    return 'Chưa đúng nước kỳ vọng';
}

function formatBenchmarkMove(result) {
    if (!result || !Number.isInteger(result.row) || !Number.isInteger(result.col)) {
        return 'Nước - / điểm -';
    }

    return `Nước ${String.fromCharCode(65 + result.col)}${result.row + 1} / điểm ${result.score}`;
}
