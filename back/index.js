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
        let user = {username: 'Anon'};
        try {
            user = await User.findOne(req.query);
        } catch (e) {
            console.error(e);
        }
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
        const messages = await Message.find().populate('user');
        ws.send(JSON.stringify({
            type: 'LATEST_MESSAGES',
            messages: messages.map(m => ({author: m.user.username, datetime: m.datetime, message: m.text}))
        }));
        console.log(messages.map(m => ({author: m.user.username, datetime: m.datetime, message: m.text})));

        ws.on('message', async msg => {
            console.log('message from ', user.username, ' : ', msg);
            const parsed = JSON.parse(msg);
            switch (parsed.type) {
                case 'SEND_MESSAGE':
                    const receivedMessage = {
                        message: parsed.message,
                        author: user.username,
                        datetime: Date.now(),
                    };
                    const message = new Message({text: receivedMessage.message, user: user._id, datetime: receivedMessage.datetime});
                    message.save();
                    Object.keys(connections).forEach(c => {
                        connections[c].send(JSON.stringify({
                            type: 'RECEIVE_MESSAGE',
                            ...receivedMessage
                        }))
                    });
                    break;
                case 'LAST_MESSAGES':
                    const messages = await Message.find();
                    console.log(messages);
                    break;
                default:
                    break;
            }
        });

        ws.on('close', msg => {
            console.log('disconnected', id);
            Object.keys(connections).forEach(c => {
                connections[c].send(JSON.stringify({
                    type: 'USER_LOGOUT',
                    user: user.username
                }))
            });
            delete connections[user.username]
        })
    });

    app.listen(port, () => {
        console.log('Server is running on port: ', port);
    });

};

run().catch(e => console.error(e));
