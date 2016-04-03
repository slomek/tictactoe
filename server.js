import api from './api';

import express from 'express';

let app = express();

// REST views for a game vs CPU

// Starting a new game
app.get('/api/start', (req, res) => {
    api.start();

    let state = api.getBoardState();
    res.json(state);
});

// Marking a cell by user
app.get('/api/:row/:col/:val', (req, res) => {
    let {row, col, val} = req.params;

    api.mark(row, col, val);

    let state = api.getBoardState();
    res.json(state);
});

// Marking a cell by CPU
app.get('/api/cpu/:val', (req, res) => {
    let {val} = req.params;

    api.cpuMove(val);

    let state = api.getBoardState();
    res.json(state);
});

app.use(express.static('public'));


app.listen(3000, () => {
    console.log('Server started on port 3000');
});

// Initialize WS server
import './websockets';