# Tic Tac Toe

## Installation and running

    npm install
    npm start

Application should be available on [localhost:3000](http://localhost:3000).

## Single player version

Make sure that `RestGameStore` is uncommented.

    // Enable multiplayer mode:
    // let GameStore = WsGameStore;
    // Disable multiplayer mode:
    let GameStore = RestGameStore;

## Mutliplayer version

Make sure that `WsGameStore` is uncommented.

    // Enable multiplayer mode:
    let GameStore = WsGameStore;
    // Disable multiplayer mode:
    // let GameStore = RestGameStore;
