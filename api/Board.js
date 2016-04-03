import {Cell} from './Cell';

export class Board {

    constructor() {
        this.cells = [[], [], []];
        this.finished = false;
        this.lastMove = '';
        this.empty = 9; // board is all empty af the beginning

        // Initialize 2D array
        for (var row = 0; row < 3; row += 1) {
            for (var col = 0; col < 3; col += 1) {
                this.cells[row][col] = new Cell(row, col);
            }
        }
    }

    // Build a triple of cells to calculate how attractive it should be to CPU
    rowScore(row, val, bonus = 0) {
        let cells = [
            this.cells[row][0],
            this.cells[row][1],
            this.cells[row][2]
        ];
        return this.score(cells, val, bonus);
    }

    // Build a triple of cells to calculate how attractive it should be to CPU
    colScore(col, val, bonus = 0) {
        let cells = [
            this.cells[0][col],
            this.cells[1][col],
            this.cells[2][col]
        ];
        return this.score(cells, val, bonus);
    }

    // Build a triple of cells to calculate how attractive it should be to CPU
    lrCrossScore(val, bonus = 0) {
        let cells = [
            this.cells[0][0],
            this.cells[1][1],
            this.cells[2][2]
        ];
        return this.score(cells, val, bonus);
    }

    // Build a triple of cells to calculate how attractive it should be to CPU
    rlCrossScore(val, bonus = 0) {
        let cells = [
            this.cells[0][2],
            this.cells[1][1],
            this.cells[2][0]
        ];
        return this.score(cells, val, bonus);
    }

    // Calculate how much the CPU should be interested in marking a cell in this triple.
    // Bonus is given if the cell is in the middle, as it should be considered a better move in general.
    score(cells, val, bonus = 0) {
        let values = cells[0].value + cells[1].value + cells[2].value;

        // No cells marked among three - noting especially tempting.
        if (values.length === 0) {
            return bonus;
        }
        // Once cell marked - a little bit more interesting
        if (values.length === 1) {
            return bonus + 1;
        }
        // Two cells marked, important!
        if (values === 'XX' || values === 'OO') {
            // If we can put the third in line - we have to go for it
            if (values[0] === val) {
                return 3;
            } else {
                // Have to block the rival from winning
                return 2;
            }
        }

        // Line contains mixed cells - nothing is going to happen.
        return -1;
    }

    markCell(row, col, val) {
        // If cell is marked, game is finished, or it's not our move, our hands are tied.
        if (this.finished || this.lastMove == val || this.cells[row][col].value) {
            return;
        }

        let cellScores = this.cells[row][col].scores(this, val);
        // Check how good the choices were (important later)
        let orderedScores = cellScores.sort((cs1, cs2) => {
            let scoreDiff = cs2.score - cs1.score;
            return scoreDiff;
        });

        this.cells[row][col].mark(val);
        // one less empty cells left
        this.empty -= 1;
        // remember who made the last move
        this.lastMove = val;

        // if we marked the last empty cell, game ends here
        if (this.empty === 0) {
            this.finished = '-';
        }
        // if we chose the winning move, game ends here
        if (orderedScores[0].score === 3) {
            this.finished = val;
        }
    }

    makeCpuMove(val) {
        // If game is finished, or it's not our move, our hands are tied.
        if (this.finished || this.lastMove == val) {
            return;
        }

        // find all possible moves
        let ranking = [];
        for (var row = 0; row < 3; row += 1) {
            for (var col = 0; col < 3; col += 1) {
                let cellScores = this.cells[row][col].scores(this, val);
                for (var cs of cellScores) {
                    ranking.push(cs);
                }
            }
        }

        let orderedRanking = ranking.sort((cs1, cs2) => {
            let scoreDiff = cs2.score - cs1.score;
            return scoreDiff;
        });

        // get the best one
        let bestMatch = orderedRanking[0];

        this.markCell(bestMatch.cell.row, bestMatch.cell.col, val);
    }

    // return the state to the players
    getState() {
        let cellsState = [[], [], []];

        for (var row = 0; row < 3; row += 1) {
            for (var col = 0; col < 3; col += 1) {
                cellsState[row][col] = this.cells[row][col].value;
            }
        }
        return {
            finished: this.finished,
            cells: cellsState
        };
    }

}