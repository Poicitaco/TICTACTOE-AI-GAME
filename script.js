document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const winningLine = document.getElementById('winning-line');
    const resetButton = document.getElementById('reset-button');
    const playAgainButton = document.getElementById('play-again-button');
    const algorithmSelect = document.getElementById('algorithm-select');
    const depthRange = document.getElementById('depth-range');
    const depthRangeValue = document.getElementById('depth-range-value');
    const difficultySelect = document.getElementById('difficulty-select');
    const battleLog = document.getElementById('battle-log');
    const undoButton = document.getElementById('undo-button');
    const hintButton = document.getElementById('hint-button');
    const historyButton = document.getElementById('history-button');
    const settingsButton = document.getElementById('settings-button');
    const rulesButton = document.getElementById('rules-button');
    const gameView = document.getElementById('game-view');
    const dashboardView = document.getElementById('dashboard-view');
    const testsView = document.getElementById('tests-view');
    const historyView = document.getElementById('history-view');
    const reportView = document.getElementById('report-view');
    const matchHistoryList = document.getElementById('match-history-list');
    const clearHistoryButton = document.getElementById('clear-history-button');
    const replayBoard = document.getElementById('replay-board');
    const replayTitle = document.getElementById('replay-title');
    const replayMeta = document.getElementById('replay-meta');
    const replayMoves = document.getElementById('replay-moves');
    const aiThinkingPanel = document.getElementById('ai-thinking-panel');
    const aiThinkingStatus = document.getElementById('ai-thinking-status');
    const aiProgressBar = document.getElementById('ai-progress-bar');
    const aiDepthTrack = document.getElementById('ai-depth-track');
    const currentHeuristicDisplay = document.getElementById('current-heuristic-display');
    const thinkingPhaseDisplay = document.getElementById('thinking-phase-display');
    const hintCandidates = document.getElementById('hint-candidates');
    const runBenchmarkButton = document.getElementById('run-benchmark-button');
    const exportCsvButton = document.getElementById('export-csv-button');
    const exportPdfButton = document.getElementById('export-pdf-button');
    const dashboardDepthMirror = document.getElementById('dashboard-depth-mirror');
    const loadMoreTestButton = document.getElementById('load-more-test-button');
    const testCaseSelect = document.getElementById('test-case-select');
    const testCaseList = document.getElementById('test-case-list');
    const loadTestCaseButton = document.getElementById('load-test-case-button');
    const runSelectedTestButton = document.getElementById('run-selected-test-button');
    const testPreviewBoard = document.getElementById('test-preview-board');
    const vectorPreviewBoard = document.getElementById('vector-preview-board');
    const scenarioTitle = document.getElementById('scenario-title');
    const selectedTestOutput = document.getElementById('selected-test-output');
    const vectorScenario = document.getElementById('vector-scenario');
    const vectorDifficulty = document.getElementById('vector-difficulty');
    const vectorBias = document.getElementById('vector-bias');
    const benchmarkTable = document.getElementById('benchmark-table');
    const benchmarkStatus = document.getElementById('benchmark-status');
    const nodeChart = document.getElementById('node-chart');
    const runtimeChart = document.getElementById('runtime-chart');
    const caseCount = document.getElementById('case-count');
    const nodeReduction = document.getElementById('node-reduction');
    const fastestAlgorithm = document.getElementById('fastest-algorithm');
    const reportTotalCases = document.getElementById('report-total-cases');
    const reportNodeReduction = document.getElementById('report-node-reduction');
    const infoDialog = document.getElementById('info-dialog');
    const gameOverDialog = document.getElementById('game-over-dialog');
    const dialogTitle = document.getElementById('dialog-title');
    const dialogBody = document.getElementById('dialog-body');
    const resultTitle = document.getElementById('result-title');
    const resultBody = document.getElementById('result-body');

    const displays = {
        depth: document.getElementById('depth-display'),
        depthRequested: document.getElementById('depth-requested-display'),
        score: document.getElementById('score-display'),
        runtime: document.getElementById('runtime-display'),
        states: document.getElementById('states-display'),
        move: document.getElementById('move-display'),
        turn: document.getElementById('turn-display'),
        humanScore: document.getElementById('human-score'),
        aiScore: document.getElementById('ai-score'),
        humanChip: document.getElementById('human-score-chip'),
        aiChip: document.getElementById('ai-score-chip'),
        turnPill: document.getElementById('turn-pill'),
    };

    const BOARD_SIZE = 10;
    const MAX_REALTIME_DEPTH = 4;
    const MATCH_HISTORY_KEY = 'caroMatchHistory';
    const CURRENT_MATCH_KEY = 'caroCurrentMatch';
    let board = createBoard(BOARD_SIZE);
    let currentPlayer = 'X';
    let gameOver = false;
    let aiThinking = false;
    let scores = { X: 0, O: 0 };
    let moveHistory = [];
    let hintedCell = null;
    let lastMove = null;
    let aiVsAiRunning = false;
    let aiVsAiTimer = null;
    let thinkingTimer = null;
    let lastBenchmarkRows = [];
    let matchHistory = loadMatchHistory();
    let activeReplayId = null;

    initializeGame();
    bindEvents();
    renderBenchmarkIntro();
    initializeDepthVisual();
    initializeTestCaseSelector();

    function bindEvents() {
        resetButton.addEventListener('click', initializeGame);
        playAgainButton.addEventListener('click', () => {
            closeDialog(gameOverDialog);
            initializeGame();
        });
        algorithmSelect.addEventListener('change', syncControlDisplays);
        depthRange.addEventListener('input', syncControlDisplays);
        dashboardDepthMirror.addEventListener('input', () => {
            depthRange.value = dashboardDepthMirror.value;
            syncControlDisplays();
        });
        difficultySelect.addEventListener('change', applyDifficulty);
        undoButton.addEventListener('click', undoRound);
        hintButton.addEventListener('click', showHint);
        document.getElementById('ai-vs-ai-button').addEventListener('click', startAiVsAi);
        document.getElementById('stop-ai-vs-ai-button').addEventListener('click', stopAiVsAi);
        historyButton.addEventListener('click', () => switchView('history'));
        clearHistoryButton.addEventListener('click', clearMatchHistory);
        settingsButton.addEventListener('click', () => showInfo(
            'Cài đặt hiện tại',
            `Thuật toán: ${algorithmSelect.options[algorithmSelect.selectedIndex].text}\nĐộ sâu tìm kiếm: ${depthRange.value}\nBàn cờ: 10x10\nĐiều kiện thắng: ${WIN_LENGTH} quân liên tiếp`
        ));
        rulesButton.addEventListener('click', () => showInfo(
            'Luật chơi Caro',
            'Người chơi đặt X trên bàn 10x10. Máy đặt O. Bên đầu tiên nối được 4 quân liên tiếp theo ngang, dọc hoặc chéo sẽ thắng. Dùng Gợi ý để xem nước đi tốt cho người chơi và Hoàn tác để lùi lại cặp nước gần nhất.'
        ));
        runBenchmarkButton.addEventListener('click', renderBenchmarkDashboard);
        exportCsvButton.addEventListener('click', exportBenchmarkCsv);
        exportPdfButton.addEventListener('click', () => window.print());
        testCaseSelect.addEventListener('change', renderSelectedTestPreview);
        loadTestCaseButton.addEventListener('click', loadSelectedTestCaseIntoGame);
        runSelectedTestButton.addEventListener('click', runSelectedTestCase);
        loadMoreTestButton.addEventListener('click', () => {
            testCaseSelect.focus();
            renderSelectedTestPreview();
        });
        document.querySelectorAll('.header-tab').forEach((button) => {
            button.addEventListener('click', () => switchView(button.dataset.view));
        });
        document.querySelectorAll('[data-close-dialog]').forEach((button) => {
            button.addEventListener('click', () => closeDialog(button.closest('dialog')));
        });
        document.querySelectorAll('.mobile-nav-item').forEach((button) => {
            button.addEventListener('click', () => switchMobilePanel(button.dataset.panel));
        });
    }

    function initializeGame() {
        archiveUnfinishedMatch();
        stopAiVsAi(false);
        board = createBoard(BOARD_SIZE);
        currentPlayer = 'X';
        gameOver = false;
        aiThinking = false;
        moveHistory = [];
        hintedCell = null;
        lastMove = null;
        hideWinningLine();
        stopThinkingAnimation();
        closeDialog(gameOverDialog);
        renderBoard();
        resetStats();
        addLog('SYS', 'Sẵn sàng bắt đầu ván mới');
        updateTurn('Lượt của bạn');
        localStorage.removeItem(CURRENT_MATCH_KEY);
    }

    function renderBoard() {
        boardElement.innerHTML = '';
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const cell = document.createElement('button');
                cell.type = 'button';
                cell.className = 'cell';
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.setAttribute('aria-label', `Row ${r + 1}, Column ${c + 1}`);

                const value = board[r][c];
                if (value) {
                    cell.classList.add(value);
                    cell.innerHTML = value === 'X' ? createXToken() : createOToken();
                    cell.disabled = true;
                }

                if (hintedCell && hintedCell.row === r && hintedCell.col === c) {
                    cell.classList.add('is-hint');
                }

                if (lastMove && lastMove.row === r && lastMove.col === c) {
                    cell.classList.add('is-last');
                }

                cell.addEventListener('click', handleCellClick);
                boardElement.appendChild(cell);
            }
        }
    }

    function handleCellClick(event) {
        if (gameOver || aiThinking || aiVsAiRunning || currentPlayer !== 'X') return;

        const row = Number(event.currentTarget.dataset.row);
        const col = Number(event.currentTarget.dataset.col);

        if (!isValidMove(board, row, col)) return;

        hintedCell = null;
        hintCandidates.innerHTML = '<p>Bấm Gợi ý để AI phân tích các nước tốt cho X.</p>';
        commitMove(row, col, 'X');
        addLog('X', `Đặt tại ${formatMove(row, col)}`);
        renderBoard();

        if (finishIfTerminal('X')) return;

        currentPlayer = 'O';
        aiThinking = true;
        updateTurn('AI đang suy nghĩ');
        startThinkingAnimation(Number(depthRange.value), evaluateBoard(board));
        window.setTimeout(aiTurn, 140);
    }

    function aiTurn() {
        const algorithm = algorithmSelect.value;
        const requestedDepth = Number(depthRange.value);
        const depth = Math.min(requestedDepth, MAX_REALTIME_DEPTH);
        const startTime = performance.now();
        const bestMove = findAiMove(algorithm, depth);
        const runtime = performance.now() - startTime;

        if (bestMove && Number.isInteger(bestMove.row) && Number.isInteger(bestMove.col)) {
            commitMove(bestMove.row, bestMove.col, 'O');
            updateAIStats(bestMove, runtime, bestMove.depthReached || depth, requestedDepth);
            addLog('O', `Đặt tại ${formatMove(bestMove.row, bestMove.col)}`);

            if (requestedDepth > depth) {
                addLog('SYS', `Độ sâu realtime được giới hạn ở ${depth}`);
            }

            renderBoard();
            if (finishIfTerminal('O')) return;
        }

        stopThinkingAnimation();
        aiThinking = false;
        currentPlayer = 'X';
        updateTurn('Lượt của bạn');
    }

    function applyDifficulty() {
        depthRange.value = difficultySelect.value;
        syncControlDisplays();
        addLog('SYS', `Độ khó: ${difficultySelect.options[difficultySelect.selectedIndex].text}`);
    }

    // Bonus: AI đấu AI. X chọn nước làm điểm evaluation nhỏ nhất, O chọn nước bằng thuật toán đang chọn.
    function startAiVsAi() {
        initializeGame();
        aiVsAiRunning = true;
        addLog('SYS', 'Bắt đầu chế độ AI đấu AI');
        updateTurn('AI đấu AI');
        scheduleAiVsAiTurn();
    }

    function stopAiVsAi(writeLog = true) {
        aiVsAiRunning = false;
        if (aiVsAiTimer) {
            window.clearTimeout(aiVsAiTimer);
            aiVsAiTimer = null;
        }
        if (writeLog) {
            addLog('SYS', 'Đã dừng chế độ AI đấu AI');
            updateTurn(gameOver ? displays.turn.textContent : 'Lượt của bạn');
        }
    }

    function scheduleAiVsAiTurn() {
        if (!aiVsAiRunning || gameOver) return;
        aiVsAiTimer = window.setTimeout(playAiVsAiTurn, 260);
    }

    function playAiVsAiTurn() {
        if (!aiVsAiRunning || gameOver) return;

        const requestedDepth = Number(depthRange.value);
        const depth = Math.min(requestedDepth, MAX_REALTIME_DEPTH);
        const startTime = performance.now();
        // Ca hai ben deu dung cung thuat toan va cung do sau.
        // X la nguoi minimize (tim score nho nhat vi evaluateBoard tinh theo goc O).
        // O la nguoi maximize (tim score lon nhat).
        const move = currentPlayer === 'O'
            ? findAiMove(algorithmSelect.value, depth)
            : findAiMoveChoX(algorithmSelect.value, depth);
        const runtime = performance.now() - startTime;

        if (!move || !Number.isInteger(move.row) || !Number.isInteger(move.col)) {
            stopAiVsAi();
            return;
        }

        commitMove(move.row, move.col, currentPlayer);
        startThinkingAnimation(depth, evaluateBoard(board));
        updateAIStats(move, runtime, move.depthReached || depth, requestedDepth);
        stopThinkingAnimation();
        addLog(currentPlayer, `AI đặt tại ${formatMove(move.row, move.col)}`);
        renderBoard();

        if (finishIfTerminal(currentPlayer)) {
            stopAiVsAi(false);
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurn(`AI ${currentPlayer} đang suy nghĩ`);
        scheduleAiVsAiTurn();
    }

    // Chọn thuật toán AI theo dropdown.
    // Minimax là Level 1, Alpha-Beta là Level 2, Iterative Deepening là phần mở rộng.
    function findAiMove(algorithm, depth) {
        if (algorithm === 'minimax') {
            return findBestMoveMinimax(board, depth);
        }

        if (algorithm === 'iterative') {
            return findBestMoveIterativeDeepening(board, depth);
        }

        return findBestMoveAlphaBeta(board, depth);
    }

    function commitMove(row, col, player) {
        makeMove(board, row, col, player);
        lastMove = { row, col, player };
        moveHistory.push({ row, col, player });
        saveCurrentSnapshot('Đang chơi');
    }

    function finishIfTerminal(player) {
        const winInfo = getWinningLine(board, player);
        if (winInfo) {
            gameOver = true;
            aiThinking = false;
            scores[player] += 1;
            updateScores();
            showWinningLine(winInfo);
            const winner = player === 'X' ? 'Bạn thắng' : 'AI thắng';
            updateTurn(winner);
            addLog('SYS', `${winner} với ${WIN_LENGTH} quân liên tiếp`);
            saveCurrentMatch(winner, winInfo);
            localStorage.removeItem(CURRENT_MATCH_KEY);
            showResult(winner, player === 'X' ? 'Chuỗi X của bạn đã nối được trước.' : 'AI đã hoàn thành chuỗi O trước.');
            return true;
        }

        if (isBoardFull(board)) {
            gameOver = true;
            aiThinking = false;
            updateTurn('Hòa');
            addLog('SYS', 'Bàn cờ đã đầy: hòa');
            saveCurrentMatch('Hòa', null);
            localStorage.removeItem(CURRENT_MATCH_KEY);
            showResult('Hòa', 'Không còn ô trống trên bàn cờ.');
            return true;
        }

        return false;
    }

    function getWinningLine(sourceBoard, player) {
        const directions = [
            [0, 1],
            [1, 0],
            [1, 1],
            [1, -1],
        ];

        for (let r = 0; r < sourceBoard.length; r++) {
            for (let c = 0; c < sourceBoard[r].length; c++) {
                if (sourceBoard[r][c] !== player) continue;

                for (const [dr, dc] of directions) {
                    const endRow = r + (WIN_LENGTH - 1) * dr;
                    const endCol = c + (WIN_LENGTH - 1) * dc;
                    if (!sourceBoard[endRow] || sourceBoard[endRow][endCol] !== player) continue;

                    let won = true;
                    for (let i = 1; i < WIN_LENGTH; i++) {
                        if (sourceBoard[r + i * dr][c + i * dc] !== player) {
                            won = false;
                            break;
                        }
                    }
                    if (won) {
                        return { start: { row: r, col: c }, end: { row: endRow, col: endCol } };
                    }
                }
            }
        }

        return null;
    }

    function showWinningLine(line) {
        const boardRect = boardElement.getBoundingClientRect();
        const wrapRect = boardElement.parentElement.getBoundingClientRect();
        const cellSize = boardRect.width / BOARD_SIZE;
        const startX = boardRect.left - wrapRect.left + (line.start.col + 0.5) * cellSize;
        const startY = boardRect.top - wrapRect.top + (line.start.row + 0.5) * cellSize;
        const endX = boardRect.left - wrapRect.left + (line.end.col + 0.5) * cellSize;
        const endY = boardRect.top - wrapRect.top + (line.end.row + 0.5) * cellSize;
        const length = Math.hypot(endX - startX, endY - startY);
        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

        winningLine.style.width = `${length}px`;
        winningLine.style.transform = `translate(${startX}px, ${startY - 2}px) rotate(${angle}deg)`;
        winningLine.classList.add('is-visible');
    }

    function hideWinningLine() {
        winningLine.classList.remove('is-visible');
        winningLine.style.width = '0';
    }

    function updateAIStats(moveData, runtime, depth, requestedDepth) {
        displays.depth.textContent = depth;
        displays.depthRequested.textContent = requestedDepth;
        displays.move.textContent = formatMove(moveData.row, moveData.col);
        displays.score.textContent = Number.isFinite(moveData.score) ? formatSigned(moveData.score) : '-';
        displays.states.textContent = Number.isFinite(moveData.states) ? moveData.states.toLocaleString() : '-';
        displays.runtime.textContent = `${runtime.toFixed(0)}ms`;
        currentHeuristicDisplay.textContent = Number.isFinite(moveData.score) ? formatSigned(moveData.score) : '-';
        renderDepthVisual(depth, requestedDepth);
    }

    function resetStats() {
        syncControlDisplays();
        displays.score.textContent = '-';
        displays.runtime.textContent = '-';
        displays.states.textContent = '-';
        displays.move.textContent = '-';
        currentHeuristicDisplay.textContent = formatSigned(evaluateBoard(board));
        thinkingPhaseDisplay.textContent = 'Sẵn sàng';
        aiThinkingStatus.textContent = 'Đang chờ lượt';
        aiProgressBar.style.width = '0%';
        battleLog.innerHTML = '';
        updateScores();
    }

    function syncControlDisplays() {
        const requestedDepth = Number(depthRange.value);
        const depth = Math.min(requestedDepth, MAX_REALTIME_DEPTH);
        depthRangeValue.textContent = requestedDepth;
        dashboardDepthMirror.value = requestedDepth;
        displays.depth.textContent = depth;
        displays.depthRequested.textContent = requestedDepth;
        renderDepthVisual(depth, requestedDepth);
    }

    function updateScores() {
        displays.humanScore.textContent = scores.X;
        displays.aiScore.textContent = scores.O;
    }

    function updateTurn(label) {
        displays.turn.textContent = label;
        displays.humanChip.classList.toggle('is-active', currentPlayer === 'X' && !gameOver);
        displays.aiChip.classList.toggle('is-active', currentPlayer === 'O' && !gameOver);
    }

    function undoRound() {
        if (aiThinking || moveHistory.length === 0) return;
        hideWinningLine();
        gameOver = false;
        hintedCell = null;

        let removed = 0;
        while (moveHistory.length && removed < 2) {
            const move = moveHistory.pop();
            board[move.row][move.col] = null;
            removed++;
            if (move.player === 'X') break;
        }

        lastMove = moveHistory[moveHistory.length - 1] || null;
        currentPlayer = 'X';
        saveCurrentSnapshot(moveHistory.length ? 'Đang chơi' : 'Ván trống');
        updateTurn('Lượt của bạn');
        addLog('SYS', 'Đã hoàn tác');
        renderBoard();
    }

    function showHint() {
        if (gameOver || aiThinking || currentPlayer !== 'X') return;

        const recommendations = getHumanHintCandidates();
        const move = recommendations[0];
        if (!move) return;

        hintedCell = move;
        displays.move.textContent = formatMove(move.row, move.col);
        displays.score.textContent = formatSigned(move.score);
        hintCandidates.innerHTML = recommendations.map((candidate, index) => `
            <div class="hint-row">
                <strong>#${index + 1}</strong>
                <div>
                    <strong>${formatMove(candidate.row, candidate.col)}</strong>
                    <span>${candidate.reason}</span>
                    <small>${candidate.reply ? `Dự đoán O đáp ${formatMove(candidate.reply.row, candidate.reply.col)} | ${candidate.states.toLocaleString()} node` : 'Không cần dự đoán phản công'}</small>
                </div>
                <span class="hint-score">${formatSigned(candidate.score)}</span>
            </div>
        `).join('');
        addLog('SYS', `Gợi ý tốt nhất: ${formatMove(move.row, move.col)}`);
        renderBoard();
    }

    function getHumanHintCandidates() {
        const moves = getCandidateMoves(board, 2, 16);
        const hintDepth = Math.min(2, Math.max(1, Number(depthRange.value)));

        return moves.map((move) => analyzeHumanHintMove(move, hintDepth))
            .sort((a, b) => a.score - b.score)
            .slice(0, 3);
    }

    function analyzeHumanHintMove(move, hintDepth) {
        const nextBoard = board.map((row) => [...row]);
        makeMove(nextBoard, move.row, move.col, 'X');
        const heuristic = evaluateBoard(nextBoard);

        if (checkWin(nextBoard, 'X')) {
            return {
                ...move,
                score: -WIN_SCORE * 2,
                states: 0,
                reply: null,
                reason: 'Nước thắng ngay cho X',
            };
        }

        const dangerBoard = board.map((row) => [...row]);
        makeMove(dangerBoard, move.row, move.col, 'O');
        const blocksImmediateWin = checkWin(dangerBoard, 'O');

        const reply = findBestMoveAlphaBeta(nextBoard.map((row) => [...row]), hintDepth);
        const replyScore = Number.isFinite(reply.score) ? reply.score : heuristic;
        const score = replyScore + heuristic * 0.15 - (blocksImmediateWin ? 25000 : 0);

        return {
            ...move,
            score: Math.round(score),
            states: reply.states || 0,
            reply: Number.isInteger(reply.row) ? reply : null,
            reason: describeHintReason(blocksImmediateWin, heuristic, replyScore),
        };
    }

    function describeHintReason(blocksImmediateWin, heuristic, replyScore) {
        if (blocksImmediateWin) return 'Ưu tiên chặn O thắng ngay';
        if (replyScore < -1200) return 'Sau khi xét phản công, X vẫn tạo áp lực mạnh';
        if (heuristic < 0 && replyScore < 0) return 'Cải thiện thế trận và hạn chế nước đáp của O';
        if (replyScore < 1200) return 'Giữ thế cân bằng sau nước phản công tốt nhất của O';
        return 'Nước an toàn tạm thời, nhưng O còn phản công mạnh';
    }

    function renderBenchmarkIntro() {
        caseCount.textContent = testCases.length;
    }

    function renderBenchmarkDashboard() {
        benchmarkStatus.textContent = 'Đang chạy...';
        runBenchmarkButton.disabled = true;

        window.setTimeout(() => {
            const selectedDepth = Number(dashboardDepthMirror.value || depthRange.value);
            const rows = runAllBenchmarks([selectedDepth]);
            lastBenchmarkRows = rows;
            benchmarkTable.innerHTML = rows.map(renderBenchmarkRow).join('');
            renderCharts(rows);
            renderBenchmarkMetrics(rows);
            updateReportMetrics(rows);
            saveBenchmarkLog(rows);
            benchmarkStatus.textContent = `Hoàn tất: ${rows.length} dòng`;
            runBenchmarkButton.disabled = false;
        }, 50);
    }

    function renderBenchmarkRow(row) {
        const mini = row.minimax.result;
        const alpha = row.alphabeta.result;
        return `
            <tr>
                <td rowspan="2"><strong>${row.caseName}</strong><br>${row.description}</td>
                <td>Minimax</td>
                <td>${formatMove(mini.row, mini.col)}</td>
                <td>${mini.score}</td>
                <td>${mini.states.toLocaleString()}</td>
                <td>${row.minimax.time.toFixed(2)}ms</td>
                <td rowspan="2"><span class="match-dot">${row.sameMove ? '✓' : '!'}</span><br>${row.reduction.toFixed(1)}%</td>
            </tr>
            <tr>
                <td>Alpha-Beta</td>
                <td>${formatMove(alpha.row, alpha.col)}</td>
                <td>${alpha.score}</td>
                <td>${alpha.states.toLocaleString()}</td>
                <td>${row.alphabeta.time.toFixed(2)}ms</td>
            </tr>
        `;
    }

    function renderCharts(rows) {
        const chartRows = rows;
        const maxNodes = Math.max(...chartRows.flatMap((row) => [row.minimax.result.states, row.alphabeta.result.states]), 1);
        const maxTime = Math.max(...chartRows.flatMap((row) => [row.minimax.time, row.alphabeta.time]), 1);

        nodeChart.innerHTML = chartRows.flatMap((row) => [
            renderChartRow(`${row.caseName} M`, row.minimax.result.states, maxNodes, 'minimax-bar'),
            renderChartRow(`${row.caseName} AB`, row.alphabeta.result.states, maxNodes, 'alphabeta-bar'),
        ]).join('');

        runtimeChart.innerHTML = chartRows.flatMap((row) => [
            renderChartRow(`${row.caseName} M`, row.minimax.time, maxTime, 'minimax-bar', 'ms'),
            renderChartRow(`${row.caseName} AB`, row.alphabeta.time, maxTime, 'alphabeta-bar', 'ms'),
        ]).join('');
    }

    function renderChartRow(label, value, maxValue, className, unit = '') {
        const width = Math.max(4, (value / maxValue) * 100);
        const displayValue = unit === 'ms' ? `${value.toFixed(1)}ms` : Math.round(value).toLocaleString();
        return `
            <div class="chart-row">
                <span>${label}</span>
                <div class="chart-track"><i class="${className}" style="width:${width}%"></i></div>
                <strong>${displayValue}</strong>
            </div>
        `;
    }

    function renderBenchmarkMetrics(rows) {
        const totalMinimaxNodes = rows.reduce((sum, row) => sum + row.minimax.result.states, 0);
        const totalAlphaNodes = rows.reduce((sum, row) => sum + row.alphabeta.result.states, 0);
        const totalMinimaxTime = rows.reduce((sum, row) => sum + row.minimax.time, 0);
        const totalAlphaTime = rows.reduce((sum, row) => sum + row.alphabeta.time, 0);
        const reduction = getReductionPercent(totalMinimaxNodes, totalAlphaNodes);

        nodeReduction.textContent = `${reduction.toFixed(1)}%`;
        fastestAlgorithm.textContent = totalAlphaTime <= totalMinimaxTime ? 'Alpha-Beta' : 'Minimax';
    }

    function updateReportMetrics(rows) {
        const totalMinimaxNodes = rows.reduce((sum, row) => sum + row.minimax.result.states, 0);
        const totalAlphaNodes = rows.reduce((sum, row) => sum + row.alphabeta.result.states, 0);
        const reduction = getReductionPercent(totalMinimaxNodes, totalAlphaNodes);
        reportTotalCases.textContent = rows.length;
        reportNodeReduction.textContent = `${reduction.toFixed(1)}%`;
    }

    function saveBenchmarkLog(rows) {
        const payload = {
            savedAt: new Date().toISOString(),
            rows: rows.map((row) => ({
                caseName: row.caseName,
                depth: row.depth,
                minimaxMove: formatMove(row.minimax.result.row, row.minimax.result.col),
                alphaBetaMove: formatMove(row.alphabeta.result.row, row.alphabeta.result.col),
                minimaxNodes: row.minimax.result.states,
                alphaBetaNodes: row.alphabeta.result.states,
                minimaxTime: row.minimax.time,
                alphaBetaTime: row.alphabeta.time,
                reduction: row.reduction,
            })),
        };
        localStorage.setItem('caroBenchmarkLog', JSON.stringify(payload));
        addLog('SYS', `Đã lưu log benchmark (${rows.length} dòng)`);
    }

    function exportBenchmarkCsv() {
        if (lastBenchmarkRows.length === 0) {
            renderBenchmarkDashboard();
            return;
        }

        const csvRows = [
            ['Test case', 'Thuật toán', 'Depth', 'Nước tốt nhất', 'Score', 'Nodes', 'Thời gian ms', 'Chất lượng'],
        ];

        for (const row of lastBenchmarkRows) {
            csvRows.push([
                row.caseName,
                'Minimax',
                row.depth,
                formatMove(row.minimax.result.row, row.minimax.result.col),
                row.minimax.result.score,
                row.minimax.result.states,
                row.minimax.time.toFixed(2),
                row.quality,
            ]);
            csvRows.push([
                row.caseName,
                'Alpha-Beta',
                row.depth,
                formatMove(row.alphabeta.result.row, row.alphabeta.result.col),
                row.alphabeta.result.score,
                row.alphabeta.result.states,
                row.alphabeta.time.toFixed(2),
                `Giảm ${row.reduction.toFixed(1)}%`,
            ]);
        }

        const csv = csvRows.map((cells) => cells.map(escapeCsvCell).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'caro-benchmark.csv';
        link.click();
        URL.revokeObjectURL(url);
        addLog('SYS', 'Đã xuất CSV benchmark');
    }

    function escapeCsvCell(value) {
        return `"${String(value).replaceAll('"', '""')}"`;
    }

    function switchView(viewName) {
        const viewMap = {
            game: gameView,
            dashboard: dashboardView,
            tests: testsView,
            history: historyView,
            report: reportView,
        };

        Object.values(viewMap).forEach((view) => view.classList.remove('is-active'));
        viewMap[viewName].classList.add('is-active');
        document.querySelectorAll('.header-tab').forEach((button) => {
            button.classList.toggle('is-active', button.dataset.view === viewName);
        });

        if (viewName === 'history') {
            if (moveHistory.length && !gameOver) {
                saveCurrentSnapshot('Đang chơi');
            }
            renderMatchHistory();
        }

        window.scrollTo({ top: 0, behavior: 'auto' });
    }

    function createMatchSnapshot(result, winInfo = null, isCurrent = false) {
        return {
            id: isCurrent ? 'current-match' : String(Date.now()),
            savedAt: new Date().toISOString(),
            result,
            algorithm: algorithmSelect.options[algorithmSelect.selectedIndex].text,
            depth: Number(depthRange.value),
            board: board.map((row) => [...row]),
            moves: moveHistory.map((move) => ({ ...move })),
            winInfo,
            isCurrent,
        };
    }

    function saveCurrentSnapshot(result) {
        if (moveHistory.length === 0) {
            localStorage.removeItem(CURRENT_MATCH_KEY);
            return;
        }

        const snapshot = createMatchSnapshot(result, null, true);
        localStorage.setItem(CURRENT_MATCH_KEY, JSON.stringify(snapshot));
        activeReplayId = snapshot.id;
    }

    function loadCurrentSnapshot() {
        try {
            const match = JSON.parse(localStorage.getItem(CURRENT_MATCH_KEY));
            return match && match.moves && match.moves.length ? match : null;
        } catch {
            return null;
        }
    }

    function archiveUnfinishedMatch() {
        if (gameOver || moveHistory.length === 0) return;
        const match = createMatchSnapshot('Chưa kết thúc', null, false);
        matchHistory = [match, ...matchHistory].slice(0, 20);
        localStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(matchHistory));
        activeReplayId = match.id;
    }

    function getVisibleMatchHistory() {
        const currentMatch = loadCurrentSnapshot();
        return currentMatch ? [currentMatch, ...matchHistory] : matchHistory;
    }

    function saveCurrentMatch(result, winInfo) {
        const match = createMatchSnapshot(result, winInfo, false);

        matchHistory = [match, ...matchHistory].slice(0, 20);
        localStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(matchHistory));
        activeReplayId = match.id;
    }

    function loadMatchHistory() {
        try {
            return JSON.parse(localStorage.getItem(MATCH_HISTORY_KEY)) || [];
        } catch {
            return [];
        }
    }

    function clearMatchHistory() {
        matchHistory = [];
        activeReplayId = null;
        localStorage.removeItem(MATCH_HISTORY_KEY);
        localStorage.removeItem(CURRENT_MATCH_KEY);
        renderMatchHistory();
    }

    function renderMatchHistory() {
        const visibleHistory = getVisibleMatchHistory();

        if (visibleHistory.length === 0) {
            matchHistoryList.innerHTML = '<p>Chưa có ván đấu nào được lưu. Ván đang chơi sẽ xuất hiện ở đây sau nước đi đầu tiên.</p>';
            replayTitle.textContent = 'Chọn một ván để xem lại';
            replayMeta.textContent = '-';
            replayBoard.innerHTML = '';
            replayMoves.innerHTML = '';
            return;
        }

        if (!activeReplayId || !visibleHistory.some((match) => match.id === activeReplayId)) {
            activeReplayId = visibleHistory[0].id;
        }

        matchHistoryList.innerHTML = visibleHistory.map((match, index) => `
            <button class="history-item ${match.id === activeReplayId ? 'is-active' : ''}" type="button" data-match-id="${match.id}">
                <strong>${match.isCurrent ? 'Đang chơi' : `#${visibleHistory.length - index}`} ${match.result}</strong>
                <span>${formatDate(match.savedAt)} | ${match.algorithm} | độ sâu ${match.depth} | ${match.moves.length} nước</span>
            </button>
        `).join('');

        matchHistoryList.querySelectorAll('.history-item').forEach((button) => {
            button.addEventListener('click', () => {
                activeReplayId = button.dataset.matchId;
                renderMatchHistory();
            });
        });

        const selected = visibleHistory.find((match) => match.id === activeReplayId) || visibleHistory[0];
        renderReplay(selected);
    }

    function renderReplay(match) {
        replayTitle.textContent = match.result;
        replayMeta.textContent = `${formatDate(match.savedAt)} | ${match.algorithm} | độ sâu ${match.depth}`;
        replayBoard.innerHTML = '';
        const winningKeys = new Set((match.winInfo?.cells || []).map((cell) => `${cell.row}-${cell.col}`));

        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const cell = document.createElement('div');
                const value = match.board[r][c];
                cell.className = `replay-cell ${value || ''}`;
                if (winningKeys.has(`${r}-${c}`)) {
                    cell.classList.add('is-winning');
                }
                cell.textContent = value || '';
                replayBoard.appendChild(cell);
            }
        }

        replayMoves.innerHTML = match.moves.map((move, index) => (
            `<span>${index + 1}. ${move.player} ${formatMove(move.row, move.col)}</span>`
        )).join('');
    }

    function formatDate(value) {
        return new Date(value).toLocaleString([], {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    function findBestHumanMove() {
        return getHumanHintCandidates()[0] || null;
    }

    // AI danh vao phe X trong che do AI vs AI.
    // Dung Alpha-Beta nhung vai tro dao nguoc: X la minimize (tim score NHO nhat).
    // evaluateBoard tra ve diem theo goc do O, nen X muon chon nuoc co score thap nhat.
    function findAiMoveChoX(algorithm, depth) {
        const nuocUngVien = getCandidateMoves(board, 1, 12);
        let diemToiThieu = Infinity;
        let nuocToiUu = null;

        alphaBetaStatesSearched = 0;

        for (const nuoc of nuocUngVien) {
            const banCoTam = board.map((dong) => [...dong]);
            makeMove(banCoTam, nuoc.row, nuoc.col, 'X');

            if (checkWin(banCoTam, 'X')) {
                return { row: nuoc.row, col: nuoc.col, score: -WIN_SCORE, states: alphaBetaStatesSearched };
            }

            let diem;
            if (algorithm === 'minimax') {
                minimaxStatesSearched = 0;
                diem = minimax(banCoTam, depth - 1, true);
            } else {
                diem = alphaBeta(banCoTam, depth - 1, -Infinity, Infinity, true);
            }

            if (diem < diemToiThieu) {
                diemToiThieu = diem;
                nuocToiUu = { row: nuoc.row, col: nuoc.col };
            }
        }

        const soTrangThai = algorithm === 'minimax' ? minimaxStatesSearched : alphaBetaStatesSearched;
        return nuocToiUu ? { ...nuocToiUu, score: diemToiThieu, states: soTrangThai } : null;
    }

    function initializeDepthVisual() {
        renderDepthVisual(Number(depthRange.value), Number(depthRange.value));
    }

    function renderDepthVisual(depth, requestedDepth) {
        aiDepthTrack.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const node = document.createElement('div');
            node.className = `depth-node ${i <= depth ? 'is-active' : ''}`;
            node.textContent = `D${i}`;
            node.title = i <= requestedDepth ? `Depth ${i}` : `Ngoài depth đã chọn`;
            aiDepthTrack.appendChild(node);
        }
    }

    function startThinkingAnimation(depth, heuristic) {
        stopThinkingAnimation();
        let progress = 8;
        aiThinkingPanel.classList.add('is-thinking');
        aiThinkingStatus.textContent = 'AI Calculating...';
        thinkingPhaseDisplay.textContent = 'Đang mở rộng cây tìm kiếm';
        currentHeuristicDisplay.textContent = formatSigned(heuristic);
        renderDepthVisual(Math.max(1, Math.min(depth, 5)), Number(depthRange.value));
        aiProgressBar.style.width = `${progress}%`;
        thinkingTimer = window.setInterval(() => {
            progress = Math.min(92, progress + 9 + Math.random() * 12);
            aiProgressBar.style.width = `${progress}%`;
        }, 90);
    }

    function stopThinkingAnimation() {
        if (thinkingTimer) {
            window.clearInterval(thinkingTimer);
            thinkingTimer = null;
        }
        if (!aiProgressBar) return;
        aiProgressBar.style.width = '100%';
        window.setTimeout(() => {
            aiThinkingPanel.classList.remove('is-thinking');
            aiThinkingStatus.textContent = 'Đã tính xong';
            thinkingPhaseDisplay.textContent = 'Sẵn sàng';
            aiProgressBar.style.width = '0%';
        }, 180);
    }

    function initializeTestCaseSelector() {
        testCaseSelect.innerHTML = testCases.map((testCase, index) => (
            `<option value="${index}">${testCase.name}</option>`
        )).join('');
        renderTestCaseList();
        renderSelectedTestPreview();
    }

    function getSelectedTestCase() {
        return testCases[Number(testCaseSelect.value)] || testCases[0];
    }

    function renderSelectedTestPreview() {
        const testCase = getSelectedTestCase();
        testPreviewBoard.innerHTML = '';
        vectorPreviewBoard.innerHTML = '';
        for (let r = 0; r < testCase.board.length; r++) {
            for (let c = 0; c < testCase.board[r].length; c++) {
                const value = testCase.board[r][c];
                const cell = createPreviewCell(value);
                const vectorCell = createPreviewCell(value);
                testPreviewBoard.appendChild(cell);
                vectorPreviewBoard.appendChild(vectorCell);
            }
        }
        const occupied = testCase.board.flat().filter(Boolean).length;
        scenarioTitle.textContent = testCase.name;
        vectorScenario.textContent = `Current scenario: ${testCase.name}`;
        vectorDifficulty.textContent = occupied >= 8 ? 'EXTREME' : occupied >= 5 ? 'HARD' : 'NORMAL';
        vectorBias.textContent = evaluateBoard(testCase.board) >= 0 ? 'AI Offensive' : 'Defensive';
        selectedTestOutput.innerHTML = `<p><strong>${testCase.name}</strong></p><p>${testCase.description}</p>`;
        renderTestCaseList();
    }

    function createPreviewCell(value) {
        const cell = document.createElement('div');
        cell.className = `preview-cell ${value || ''}`;
        cell.textContent = value || '';
        return cell;
    }

    function renderTestCaseList() {
        const selectedIndex = Number(testCaseSelect.value || 0);
        testCaseList.innerHTML = testCases.map((testCase, index) => `
            <button class="scenario-card ${index === selectedIndex ? 'is-active' : ''}" type="button" data-test-index="${index}">
                <span class="scenario-thumb">${Array.from({ length: 16 }, (_, i) => `<i style="opacity:${0.25 + ((i + index) % 5) * 0.14}"></i>`).join('')}</span>
                <span>
                    <h3>${testCase.name}</h3>
                    <p>${testCase.description}</p>
                </span>
            </button>
        `).join('');

        testCaseList.querySelectorAll('.scenario-card').forEach((button) => {
            button.addEventListener('click', () => {
                testCaseSelect.value = button.dataset.testIndex;
                renderSelectedTestPreview();
            });
        });
    }

    function loadSelectedTestCaseIntoGame() {
        const testCase = getSelectedTestCase();
        archiveUnfinishedMatch();
        stopAiVsAi(false);
        board = testCase.board.map((row) => [...row]);
        currentPlayer = 'X';
        gameOver = false;
        aiThinking = false;
        hintedCell = null;
        lastMove = null;
        moveHistory = [];
        localStorage.removeItem(CURRENT_MATCH_KEY);
        hideWinningLine();
        renderBoard();
        resetStats();
        addLog('SYS', `Đã nạp test case: ${testCase.name}`);
        switchView('game');
    }

    function runSelectedTestCase() {
        const testCase = getSelectedTestCase();
        const depth = Number(depthRange.value);
        const minimax = timeSingleRun(() => findBestMoveMinimax(testCase.board.map((row) => [...row]), depth));
        const alphabeta = timeSingleRun(() => findBestMoveAlphaBeta(testCase.board.map((row) => [...row]), depth));
        selectedTestOutput.innerHTML = `
            <p><strong>${testCase.name}</strong></p>
            <p>${testCase.description}</p>
            <div class="test-result-grid">
                <div class="test-result-card">
                    <h3>Minimax</h3>
                    <p>Nước: ${formatMove(minimax.result.row, minimax.result.col)}</p>
                    <p>Score: ${minimax.result.score}</p>
                    <p>Nodes: ${minimax.result.states.toLocaleString()}</p>
                    <p>Time: ${minimax.time.toFixed(2)}ms</p>
                </div>
                <div class="test-result-card">
                    <h3>Alpha-Beta</h3>
                    <p>Nước: ${formatMove(alphabeta.result.row, alphabeta.result.col)}</p>
                    <p>Score: ${alphabeta.result.score}</p>
                    <p>Nodes: ${alphabeta.result.states.toLocaleString()}</p>
                    <p>Time: ${alphabeta.time.toFixed(2)}ms</p>
                </div>
            </div>
        `;
    }

    function timeSingleRun(callback) {
        const start = performance.now();
        const result = callback();
        return {
            result,
            time: performance.now() - start,
        };
    }

    function addLog(actor, message) {
        const line = document.createElement('div');
        const roleClass = actor === 'O' ? 'ai' : actor === 'SYS' ? 'sys' : '';
        line.className = 'log-line';
        line.innerHTML = `<time>${new Date().toLocaleTimeString([], { hour12: false })}</time><strong class="${roleClass}">${actor}</strong><span></span>`;
        line.querySelector('span').textContent = message;
        battleLog.prepend(line);
    }

    function showInfo(title, body) {
        dialogTitle.textContent = title;
        dialogBody.textContent = body;
        showDialog(infoDialog);
    }

    function showResult(title, body) {
        resultTitle.textContent = title;
        resultBody.textContent = body;
        showDialog(gameOverDialog);
    }

    function showDialog(dialog) {
        if (!dialog.open) {
            dialog.showModal();
        }
    }

    function closeDialog(dialog) {
        if (dialog && dialog.open) {
            dialog.close();
        }
    }

    function switchMobilePanel(panel) {
        document.querySelectorAll('.mobile-nav-item').forEach((button) => {
            button.classList.toggle('is-active', button.dataset.panel === panel);
        });
        document.querySelector('.left-panel').classList.toggle('is-mobile-visible', panel === 'ai');
        document.querySelector('.right-panel').classList.toggle('is-mobile-visible', panel === 'stats');
    }

    function createXToken() {
        return '<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M20 20 L60 60 M60 20 L20 60" stroke="currentColor" stroke-linecap="round" stroke-width="14"></path></svg>';
    }

    function createOToken() {
        return '<svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" fill="none" r="26" stroke="currentColor" stroke-width="14"></circle></svg>';
    }

    function formatMove(row, col) {
        return `${String.fromCharCode(65 + col)}${row + 1}`;
    }

    function formatSigned(value) {
        if (!Number.isFinite(value)) return '-';
        return value > 0 ? `+${value.toLocaleString()}` : value.toLocaleString();
    }
});
