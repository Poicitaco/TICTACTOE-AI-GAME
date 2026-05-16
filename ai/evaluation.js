// Ham danh gia trang thai cho AI.
// Diem duong: tot cho AI O. Diem am: tot cho nguoi X.
// Su dung WIN_LENGTH tu gameRules.js de tu dong thich nghi.

const WIN_SCORE = 100000;

/**
 * Danh gia toan bo ban co theo goc do AI (O).
 * Diem cang cao cang tot cho O, diem cang thap cang tot cho X.
 * @param {Array<Array<string|null>>} banCo - Ban co hien tai.
 * @returns {number} Diem heuristic.
 */
function evaluateBoard(banCo) {
    let tongDiem = 0;
    const kichThuoc = banCo.length;

    // Quet ngang
    for (let r = 0; r < kichThuoc; r++) {
        for (let c = 0; c <= kichThuoc - WIN_LENGTH; c++) {
            const cuaSo = [];
            for (let i = 0; i < WIN_LENGTH; i++) {
                cuaSo.push(banCo[r][c + i]);
            }
            tongDiem += evaluateWindow(cuaSo);
        }
    }

    // Quet doc
    for (let r = 0; r <= kichThuoc - WIN_LENGTH; r++) {
        for (let c = 0; c < kichThuoc; c++) {
            const cuaSo = [];
            for (let i = 0; i < WIN_LENGTH; i++) {
                cuaSo.push(banCo[r + i][c]);
            }
            tongDiem += evaluateWindow(cuaSo);
        }
    }

    // Quet cheo xuong phai
    for (let r = 0; r <= kichThuoc - WIN_LENGTH; r++) {
        for (let c = 0; c <= kichThuoc - WIN_LENGTH; c++) {
            const cuaSo = [];
            for (let i = 0; i < WIN_LENGTH; i++) {
                cuaSo.push(banCo[r + i][c + i]);
            }
            tongDiem += evaluateWindow(cuaSo);
        }
    }

    // Quet cheo xuong trai
    for (let r = 0; r <= kichThuoc - WIN_LENGTH; r++) {
        for (let c = WIN_LENGTH - 1; c < kichThuoc; c++) {
            const cuaSo = [];
            for (let i = 0; i < WIN_LENGTH; i++) {
                cuaSo.push(banCo[r + i][c - i]);
            }
            tongDiem += evaluateWindow(cuaSo);
        }
    }

    return tongDiem;
}

/**
 * Danh gia mot cua so WIN_LENGTH o.
 * Su dung WIN_LENGTH de tu dong thich nghi khi thay doi luat thang.
 * Diem duong: tot cho AI (O). Diem am: tot cho nguoi (X).
 * @param {Array<string|null>} cuaSo - Mang WIN_LENGTH phan tu.
 * @returns {number} Diem danh gia cua cua so nay.
 */
function evaluateWindow(cuaSo) {
    let diem = 0;
    const quanAI = cuaSo.filter(p => p === 'O').length;
    const quanNguoi = cuaSo.filter(p => p === 'X').length;
    const oTrong = cuaSo.filter(p => p === null).length;

    if (quanAI > 0 && quanNguoi > 0) {
        return 0; // Cua so co ca hai ben: khong phai moi de doa
    }

    // Danh gia phe AI (O)
    if (quanAI === WIN_LENGTH) {
        diem += WIN_SCORE;
    } else if (quanAI === WIN_LENGTH - 1 && oTrong >= 1) {
        diem += 10000; // Sap thang: can 1 nuoc nua
    } else if (quanAI === WIN_LENGTH - 2 && oTrong >= 2) {
        diem += 500;   // De doa trung binh
    } else if (quanAI === WIN_LENGTH - 3 && oTrong >= 3) {
        diem += 50;    // De doa yeu
    } else if (quanAI === 1 && oTrong >= WIN_LENGTH - 1) {
        diem += 5;     // Moi dat quan
    }

    // Danh gia phe nguoi (X): uu tien chan nguoi thang
    if (quanNguoi === WIN_LENGTH) {
        diem -= WIN_SCORE;
    } else if (quanNguoi === WIN_LENGTH - 1 && oTrong >= 1) {
        diem -= 8000;  // Nguoi sap thang: phai chan ngay
    } else if (quanNguoi === WIN_LENGTH - 2 && oTrong >= 2) {
        diem -= 500;
    } else if (quanNguoi === WIN_LENGTH - 3 && oTrong >= 3) {
        diem -= 50;
    } else if (quanNguoi === 1 && oTrong >= WIN_LENGTH - 1) {
        diem -= 5;
    }

    return diem;
}
