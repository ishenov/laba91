const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
