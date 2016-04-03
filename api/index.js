// API for front-end's store to access the moves

import {Board} from './Board';

let board;

function start() {
    board = new Board();
}

function mark(row, col, val) {
    board.markCell(row, col, val);
}

function cpuMove(val) {
    board.makeCpuMove(val);
}

function getBoardState() {
    return board.getState();
}

export default {
    start,
    mark,
    cpuMove,
    getBoardState
}