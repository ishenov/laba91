const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    whom: {
        type: String
    }
});
