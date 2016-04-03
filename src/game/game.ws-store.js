import Reflux from 'reflux';
import websocket from 'websocket';

import {GameActions} from './game.actions';

let W3CWebSocket = websocket.w3cwebsocket;

let WsGameStore = Reflux.createStore({

    client: undefined,
    playAs: '',

    init: function () {
        this.listenTo(GameActions.startGame, this.onStartGame);
        this.listenTo(GameActions.userMove, this.onUserMove);

        this.initWebsocket();
    },

    initWebsocket() {
        this.client = new W3CWebSocket('ws://localhost:3001/', 'echo-protocol');

        this.client.onerror = (err) => {
            console.log('Connection Error', err);
        };

        this.client.onclose = () => {
            console.log('echo-protocol Client Closed');
        };

        this.client.onmessage = (e) => {
            if (typeof e.data === 'string') {
                let json = JSON.parse(e.data);
                if (json.type === 'playAs') {
                    this.playAs = json.value;
                } else {
                    this.trigger(json);
                }
            }
        };
    },

    onStartGame() {
        this.client.send(JSON.stringify({type: 'start'}));
    },

    onUserMove(row, col) {
        this.client.send(JSON.stringify({type: 'play', row, col, val: this.playAs}));
    }

});

export {WsGameStore};