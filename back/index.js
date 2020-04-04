const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const expressWs = require('express-ws');
const mongoose = require('mongoose');
const Message = require('./models/Message');
const User = require('./models/User');
const users = require('./app/users');
const config = require('./config');

const app = express();

expressWs(app);


app.use(cors());
app.use(express.json());
const port = 8000;

const connections = {};


const run = async () => {
    await mongoose.connect(config.database, config.databaseOptions);

    app.use('/users', users);
    app.ws('/messenger', async function(ws, req) {
        const user = await User.findOne(req.query);
        const id = nanoid();

        console.log('client connected', user.username);
        connections[user.username] = ws;
        console.log('clients: ', Object.keys(connections).length);
        console.log(Object.keys(connections));
        Object.keys(connections).forEach(c => {
            connections[c].send(JSON.stringify({
                type: 'ACTIVE_USERS',
                userNames: Object.keys(connections)
            }));
        });

        ws.on('message', msg => {
            console.log('message from ', user.username, ' : ', msg);
            const parsed = JSON.parse(msg);
            switch (parsed.type) {
                case 'SEND_MESSAGE':
                    const receivedMessage = {
                        message: parsed.message,
                        author: user.username,
                        datetime: Date.now(),
                    };
                    const message = new Message(receivedMessage);
                    message.save();
                    Object.keys(connections).forEach(c => {
                        connections[c].send(JSON.stringify({
                            type: 'RECEIVE_MESSAGE',
                            ...receivedMessage
                        }))
                    });
                    break;
                case 'LAST_MESSAGES':

                    break;
                default:
                    break;
            }
        });

        ws.on('close', msg => {
            console.log('disconnected', id);
            delete connections[user.username]
        })
    });

    app.listen(port, () => {
        console.log('Server is running on port: ', port);
    });

};

run().catch(e => console.error(e));
