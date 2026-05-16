// Các test case bắt buộc cho phần thực nghiệm.
// Tất cả đều dùng 10x10 để giống bàn cờ trong giao diện.

const testCases = [
    {
        name: 'Opening State',
        description: 'Đầu game: bàn cờ trống, AI nên ưu tiên khu vực trung tâm.',
        board: createBoard(10),
        expectedMoves: [{ row: 5, col: 5 }],
    },
    {
        name: 'Mid-game State',
        description: 'Giữa game: hai bên đã có quân quanh trung tâm.',
        board: (() => {
            const board = createBoard(10);
            board[4][4] = 'X';
            board[3][4] = 'O';
            board[3][5] = 'X';
            board[5][5] = 'O';
            board[2][3] = 'X';
            board[5][4] = 'O';
            return board;
        })(),
        expectedMoves: [],
    },
    {
        name: 'AI Immediate Win',
        description: 'AI sắp thắng: O đã có 3 quân liên tiếp, cần đặt quân thứ 4.',
        board: (() => {
            const board = createBoard(10);
            board[4][3] = 'O';
            board[4][4] = 'O';
            board[4][5] = 'O';
            board[3][4] = 'X';
            board[5][4] = 'X';
            return board;
        })(),
        expectedMoves: [{ row: 4, col: 2 }, { row: 4, col: 6 }],
    },
    {
        name: 'Player Threat Defense',
        description: 'Người sắp thắng: X đã có 3 quân liên tiếp, AI cần chặn ngay.',
        board: (() => {
            const board = createBoard(10);
            board[4][3] = 'X';
            board[4][4] = 'X';
            board[4][5] = 'X';
            board[3][4] = 'O';
            board[5][4] = 'O';
            return board;
        })(),
        expectedMoves: [{ row: 4, col: 2 }, { row: 4, col: 6 }],
    },
    {
        name: 'Both Sides Attack',
        description: 'Hai bên đều có cơ hội tấn công, dùng để xem chất lượng evaluation.',
        board: (() => {
            const board = createBoard(10);
            board[4][4] = 'X';
            board[3][3] = 'O';
            board[5][5] = 'X';
            board[3][5] = 'O';
            board[5][3] = 'X';
            board[3][4] = 'O';
            board[4][3] = 'X';
            return board;
        })(),
        expectedMoves: [],
    },
    {
        name: 'Complex Branching State',
        description: 'Trạng thái phức tạp: nhiều nước hợp lệ làm cây tìm kiếm phân nhánh.',
        board: (() => {
            const board = createBoard(10);
            board[2][2] = 'X';
            board[2][3] = 'O';
            board[3][3] = 'X';
            board[3][4] = 'O';
            board[4][4] = 'X';
            board[4][5] = 'O';
            board[5][3] = 'X';
            board[5][5] = 'O';
            board[6][4] = 'X';
            board[6][6] = 'O';
            return board;
        })(),
        expectedMoves: [],
    },
];
