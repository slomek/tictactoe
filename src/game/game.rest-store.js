import Reflux from 'reflux';
import reqwest from 'reqwest';

import {GameActions} from './game.actions';

let RestGameStore = Reflux.createStore({

    init: function () {
        this.listenTo(GameActions.startGame, this.onStartGame);
        this.listenTo(GameActions.userMove, this.onUserMove);
        this.listenTo(GameActions.cpuMove, this.onCpuMove);
    },

    onStartGame() {
        reqwest.compat({
            url: '/api/start/',
            method: 'GET',
            success: (boardState) => {
                this.trigger(boardState);
            },
            error: (err) => {
                console.error(err);
                this.trigger({});
            }
        });
    },

    onUserMove(row, col) {
        reqwest.compat({
            url: `/api/${row}/${col}/${this.playAs}`,
            method: 'GET',
            success: (boardState) => {
                this.trigger(boardState);
            },
            error: (err) => {
                console.error(err);
                this.trigger({});
            }
        });
    },

    onCpuMove() {
        reqwest.compat({
            url: `/api/cpu/O`,
            method: 'GET',
            success: (boardState) => {
                this.trigger(boardState);
            },
            error: (err) => {
                console.error(err);
                this.trigger({});
            }
        });
    }

});

export {RestGameStore};