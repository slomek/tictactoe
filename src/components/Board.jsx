import React from 'react';

import {Cell} from './Cell.jsx';
import {GameActions} from '../game/game.actions';

import {RestGameStore} from '../game/game.rest-store';
import {WsGameStore} from '../game/game.ws-store';

// Enable multiplayer mode:
let GameStore = WsGameStore;
// Disable multiplayer mode:
// let GameStore = RestGameStore;

let Board = React.createClass({

    getInitialState() {
        return {
            finished: false,
            cells: [['', '', ''], ['', '', ''], ['', '', '']]
        };
    },

    componentDidMount() {
        GameStore.listen((state) => {
            this.setState(state)
        });

        GameActions.startGame();
    },

    renderRows() {
        let {cells} = this.state,
            rows = [];

        for (var row in cells) {
            rows.push(<div key={row}>
                <Cell key={row + "0"} value={cells[row][0]} row={row} col="0"/>
                <Cell key={row + "1"} value={cells[row][1]} row={row} col="1"/>
                <Cell key={row + "2"} value={cells[row][2]} row={row} col="2"/>
            </div>);
        }
        return rows;
    },

    resetGame() {
        GameActions.startGame();
    },

    makeCpuMove() {
        GameActions.cpuMove();
    },

    renderSummary() {
        let {finished} = this.state;

        if (finished) {
            if (finished === '-') {
                return <div className="summary">Game tied!</div>;
            } else {
                return <div className="summary">Game over: {finished} wins!</div>;
            }
        }
    },

    render() {
        return (
            <div>
                <nav>
                    <span className="btn reset-btn" onClick={this.resetGame}>RESET</span>
                    <span className="btn cpu-move-btn" onClick={this.makeCpuMove}>CPU MOVE</span>
                </nav>
                <div className="board">
                    {this.renderRows()}
                </div>
                {this.renderSummary()}
            </div>
        );
    }
});

export {Board};