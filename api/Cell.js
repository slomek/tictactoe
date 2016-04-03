export class Cell {

    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.value = '';
    }

    mark(val) {
        if (!!val) {
            this.value = val;
        }
    }

    // get a list of all possible triples the cell is in
    scores(board, val) {
        if (this.value) {
            return [];
        }

        let bonus = 0;
        if (this.row == 1 && this.col == 1) {
            // bonus if the cell is in the middle - it's just a good idea to mark it.
            bonus = 0.5;
        }

        let scores = [];

        // get horizontal line score
        scores.push({cell: this, score: board.rowScore(this.row, val, bonus)});
        // get vertival line score
        scores.push({cell: this, score: board.colScore(this.col, val, bonus)});
        // get one diameter score
        if (this.row == this.col) {
            scores.push({cell: this, score: board.lrCrossScore(val, bonus)});
        }
        // and the other one
        if (this.row + this.col == 2) {
            scores.push({cell: this, score: board.rlCrossScore(val, bonus)});
        }

        return scores;
    }

}
