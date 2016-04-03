import websocket from 'websocket';
import http from 'http';

import api from './api';

// Initialize WS server
let WebSocketServer = websocket.server;
let server = http.createServer(function(request, response) {
    response.writeHead(404);
    response.end();
});
server.listen(3001, function() {
    console.log('Websocket server started on port 3001');
});

let wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

// Store active connection to limit players to two
// [0] -> X, [1] -> O
let connections = [];

wsServer.on('request', function(request) {
    // Reject connection if table is full
    if(connections[0] && connections[1]) {
        request.reject();
    }

    // Accept connection and store it
    var connection = request.accept('echo-protocol', request.origin);
    if(!connections[0]) {
        connections[0] = connection;
        connection.sendUTF(JSON.stringify({type: 'playAs', value: 'X'}));
    } else {
        connections[1] = connection;
        connection.sendUTF(JSON.stringify({type: 'playAs', value: 'O'}));
    }

    // React to incoming messages
    connection.on('message', function(message) {
        let json = JSON.parse(message.utf8Data);

        if (json.type === 'start') {
            // Handle message for starting a new game
            api.start();

            let state = api.getBoardState();
            broadcast(state);
        } else {
            // Handle message for making a move by one of the players
            let {row, col, val} = json;

            api.mark(row, col, val);

            let state = api.getBoardState();
            broadcast(state);
        }

    });

    // Remove player from the table on disconnect
    connection.on('close', function() {
        if(connections[0] == connection) {
            connections[0] = null;
        }
        if(connections[1] == connection) {
            connections[1] = null;
        }
    });
});

// Broadcast message to players, if they actually exist
function broadcast(message) {
    if(connections[0]) {
        connections[0].sendUTF(JSON.stringify(message));
    }
    if(connections[1]) {
        connections[1].sendUTF(JSON.stringify(message));
    }
}

