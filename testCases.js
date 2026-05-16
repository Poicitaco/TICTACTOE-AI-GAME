// Cac test case bat buoc cho phan thuc nghiem.
// Tat ca deu dung 10x10 de giong ban co trong giao dien.
// Win condition: WIN_LENGTH = 4 quan lien tiep (theo yeu cau de bai).

const testCases = [
    {
        name: 'Opening State',
        description: 'Dau game: ban co trong, AI nen uu tien khu vuc trung tam.',
        board: createBoard(10),
        expectedMoves: [{ row: 5, col: 5 }],
    },
    {
        name: 'Mid-game State',
        description: 'Giua game: hai ben da co quan quanh trung tam.',
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
        description: 'AI sap thang: O da co 3 quan lien tiep, can dat quan thu 4.',
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
        description: 'Nguoi sap thang: X da co 3 quan lien tiep, AI can chan ngay.',
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
        description: 'Hai ben deu co co hoi tan cong, dung de xem chat luong evaluation.',
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
        description: 'Trang thai phuc tap: nhieu nuoc hop le lam cay tim kiem phan nhanh.',
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
