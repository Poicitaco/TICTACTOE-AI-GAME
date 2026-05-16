# Caro AI Project

This project is a web-based implementation of the game Caro (also known as Gomoku), featuring a human player against an AI opponent. The AI is powered by the Minimax algorithm and its optimization, Alpha-Beta Pruning.

## Project for University Practical Assignment

This project fulfills the requirements of a university-level practical assignment on AI and game theory.

### Features

-   **Game Engine**: Full logic for a Caro game on a 10x10 board.
-   **Winning Condition**: 4 consecutive pieces in any direction (horizontal, vertical, or diagonal).
-   **AI Opponent**:
    -   **Minimax**: The classic game theory algorithm for decision making.
    -   **Alpha-Beta Pruning**: An optimization of Minimax to reduce the search space.
    -   **Heuristic Evaluation**: A function to score non-terminal board states.
-   **Interactive UI**:
    -   Playable 10x10 glassmorphism game board based on the Stitch "Caro AI Analysis Board" screen.
    -   Real-time display of AI's decision-making process (chosen move, score, depth, states explored, runtime).
    -   Controls to switch between algorithms and set search depth.
    -   Match scores, move history, undo, hint, winning-line highlight, and game-over modal.
-   **Benchmarking**: A framework to compare the performance of Minimax and Alpha-Beta on various test cases.
-   **Dashboard + Charts**: In-browser benchmark dashboard with node-count charts, runtime charts, summary metrics, and required report sections.
-   **AI Improvements**: Move ordering for better Alpha-Beta pruning and Iterative Deepening as an optional stronger AI mode.

### Tech Stack

-   **Frontend**: HTML, CSS, Vanilla JavaScript
-   **No external libraries or frameworks** are used, focusing on core concepts.

## Project Structure

-   `/index.html`: Main application entry point.
-   `/battle-arena.css`: Styles for the Stitch-inspired UI.
-   `/script.js`: Main script for game flow and UI management.
-   `/board.js`: Board state management.
-   `/gameRules.js`: Core game logic (win/draw detection, valid moves).
-   `/ai/minimax.js`: Minimax algorithm implementation.
-   `/ai/alphabeta.js`: Alpha-Beta Pruning implementation.
-   `/ai/evaluation.js`: Heuristic evaluation function.
-   `/benchmark.js`: Performance comparison tools.
-   `/testCases.js`: Pre-defined board states for analysis.
-   `/README.md`: This file.
-   `/stitch-caro-ai-analysis-board.html`: Downloaded Stitch source HTML for reference.
-   `/stitch-caro-ai-analysis-board.png`: Downloaded Stitch screenshot for reference.

## How to Run

1.  Clone the repository.
2.  Open `index.html` in a modern web browser.

## Experimental Analysis

The project includes a set of 5 test cases to analyze the AI's performance:
1.  Opening State
2.  Mid-game
3.  AI Immediate Win
4.  Player Threat Defense
5.  Complex Branching State

The analysis compares the `Minimax` and `Alpha-Beta` algorithms based on:
-   **Move Quality**: The chosen move in each situation.
-   **Searched States**: The number of game states explored.
-   **Runtime**: The time taken to make a decision.
-   **Effect of Depth**: How performance changes with increased search depth.

## Future Improvements (Optional Bonus)

-   **Advanced Heuristics**: Improve the evaluation function to recognize more complex patterns (e.g., open-ended threes, double threats).
-   **Move Ordering**: Prioritize more promising moves to improve Alpha-Beta pruning effectiveness.
-   **Iterative Deepening**: Start with a low depth and progressively increase it, allowing the AI to make a good move quickly if time is limited.
-   **Transposition Table**: Cache evaluations of previously seen board states to avoid re-computation.
