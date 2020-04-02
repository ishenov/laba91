const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const expressWs = require('express-ws');


const app = express();

expressWs(app);


app.use(cors());
app.use(express.json());
const port = 8000;

const connections = {};
const messages = [];

app.ws('/messenger', function(ws, req) {
    console.log('client connected');
    const id = nanoid();
    connections[id] = ws;


    ws.on('close', msg => {
        console.log('disconnected', connections[id]);
    })
});
