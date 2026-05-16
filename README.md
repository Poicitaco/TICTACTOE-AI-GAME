# Caro AI - Gomoku with Minimax & Alpha-Beta Pruning

> Do an thuc hanh mon Tri Tue Nhan Tao - game Caro (Gomoku) tren nen web, tich hop AI voi hai thuat toan Minimax va Alpha-Beta Pruning de nguoi dung co the choi, phan tich va so sanh hieu nang cua cac thuat toan AI.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Gioi thieu

Du an trien khai game **Co Caro 10x10** chay tren trinh duyet, khong can cai dat them bat ky thu vien nao. AI doi thu duoc xay dung tu dau voi hai thuat toan kinh dien cua Ly Thuyet Tro Choi:

- **Minimax** - thuat toan nen tang, duyet toan bo cay tro choi den do sau gioi han.
- **Alpha-Beta Pruning** - phien ban toi uu cua Minimax, cat tinh cac nhanh chac chan khong anh huong den ket qua, giam dang ke so trang thai can duyet.

Nguoi dung co the choi, doi chieu tung nuoc di, xem so lieu phan tich theo thoi gian thuc va chay benchmark de so sanh hai thuat toan mot cach truc quan.

---

## Tinh nang chinh

### Che do choi
- Nguoi vs AI tren ban co 10x10
- Dieu kien thang: **4 quan lien tiep** theo hang ngang, doc, cheo
- Hien thi duong thang sau khi co nguoi thang

### AI va phan tich
| Tinh nang | Mo ta |
|---|---|
| Minimax | Duyet toan bo cay den do sau tuy chinh |
| Alpha-Beta Pruning | Minimax + cat tinh, giam so node can duyet |
| Iterative Deepening | Chay Alpha-Beta tu do sau 1 den do sau muc tieu, AI luon co ket qua tam thoi |
| Heuristic Evaluation | Ham danh gia diem cua cac o trong tren ban co theo mau 4-o |
| Move Ordering | Sap xep nuoc di uu tien de Alpha-Beta cat tinh hieu qua hon |
| Candidate Moves | Gioi han 12 nuoc ung vien gan quan da dat, giam khong gian tim kiem |

### Giao dien
- Thong tin real-time: nuoc di chon, diem so, do sau, so trang thai da duyet, thoi gian chay
- Chuyen doi thuat toan (Minimax / Alpha-Beta / Iterative Deepening)
- Chinh do sau tim kiem (Depth 1 den 4)
- Lich su nuoc di, ho tro Undo, goi y nuoc (Hint)
- Bang diem tich luy (AI Wins / Player Wins / Draws)

### Benchmark & Dashboard
- Chay benchmark tren 6 test case dinh san voi do sau 1-3
- So sanh: so trang thai duyet, thoi gian chay, chat luong nuoc di
- Bieu do column chart truc quan (Canvas API) the hien ket qua

---

## Cau truc du an

```
Caro/
|-- index.html           # Giao dien chinh cua game
|-- script.js            # Dieu phoi game, quan ly UI, xu ly su kien
|-- board.js             # Quan ly trang thai ban co
|-- gameRules.js         # Logic kiem tra thang/thua/hoa, nuoc di hop le
|-- battle-arena.css     # Style chinh (glassmorphism, dark mode)
|-- style.css            # Style bo sung
|-- benchmark.js         # Framework do hieu nang va so sanh thuat toan
|-- testCases.js         # 6 trang thai ban co dinh san cho phan thuc nghiem
|-- ai/
|   |-- minimax.js       # Thuat toan Minimax
|   |-- alphabeta.js     # Thuat toan Alpha-Beta Pruning + Iterative Deepening
|   |-- evaluation.js    # Ham danh gia heuristic (evaluateBoard, evaluateWindow)
|-- README.md
|-- .gitignore
```

---

## Cach chay

> **Yeu cau:** Chi can trinh duyet hien dai (Chrome, Firefox, Edge). Khong can Node.js, khong can cai dat.

1. Clone repository:
   ```bash
   git clone https://github.com/Poicitaco/TICTACTOE-AI-GAME.git
   cd TICTACTOE-AI-GAME
   ```

2. Mo file `index.html` truc tiep tren trinh duyet:
   - Nhanh doi: double-click vao `index.html`
   - Hoac dung Live Server trong VS Code

---

## Thuat toan

### Minimax
Duyet toan bo cay tro choi theo do sau `d`. Moi trang thai duoc danh gia qua ham heuristic neu chua dat ket qua cuoi.

```
findBestMoveMinimax(board, depth)
  -> minimax(board, depth, isMaximizing)
     - Base case: thang/thua/hoa/het depth => evaluateBoard()
     - Recursive: duyet cac nuoc ung vien, tra ve max/min
```

### Alpha-Beta Pruning
Them hai tham so `alpha` (gia tri tot nhat nhanh max) va `beta` (nhanh min). Cat tinh khi `beta <= alpha`, tranh duyet cac nhanh chac chan vo dung.

```
alphaBeta(board, depth, alpha, beta, isMaximizing)
  - Cat beta: nhanh max tim duoc ket qua >= beta -> bo qua
  - Cat alpha: nhanh min tim duoc ket qua <= alpha -> bo qua
```

### Ham Danh Gia Heuristic
Quet toan bo cac o-4 theo 4 huong (ngang, doc, cheo xuoi, cheo nguoc), cong diem theo cau hinh:

| Cau hinh | Diem AI (O) | Diem Nguoi (X) |
|---|---|---|
| 4 quan + 0 trong | +100,000 (thang) | -100,000 |
| 3 quan + 1 trong | +1,000 | -5,000 (uu tien chan) |
| 2 quan + 2 trong | +100 | -50 |
| 1 quan + 3 trong | +10 | -5 |

---

## Phan tich thuc nghiem

6 test case duoc dinh san de so sanh hai thuat toan:

| # | Ten | Mo ta |
|---|---|---|
| 1 | Opening State | Ban co trong, AI nen uu tien trung tam |
| 2 | Mid-game State | Hai ben da co quan quanh tam |
| 3 | AI Immediate Win | O co 3 quan lien tiep, can dat quan thu 4 |
| 4 | Player Threat Defense | X sap thang, AI can chan ngay |
| 5 | Both Sides Attack | Hai ben co co hoi tan cong dong thoi |
| 6 | Complex Branching State | Nhieu nuoc hop le, cay tim kiem phan nhanh manh |

Ket qua so sanh tap trung vao:
- **So trang thai da duyet** (Minimax vs Alpha-Beta)
- **Thoi gian chay** (ms)
- **Chat luong nuoc di** (co trung voi ket qua ky vong?)
- **Muc do giam node** (%) khi tang do sau

---

## Cong nghe su dung

- **HTML5** - cau truc giao dien
- **CSS3** - hieu ung glassmorphism, dark mode, animation
- **Vanilla JavaScript** - toan bo logic game, AI va benchmark
- **Canvas API** - ve bieu do benchmark
- Khong dung bat ky thu vien hay framework nao

---

## Tac gia

**Poicitaco**
- GitHub: [@Poicitaco](https://github.com/Poicitaco)

---

## Ghi chu

Du an nay duoc phat trien phuc vu muc dich hoc tap va nghien cuu thuat toan AI trong mon hoc Tri Tue Nhan Tao. Moi dong gop hoac phan hoi deu duoc chao don qua Issues hoac Pull Request.
