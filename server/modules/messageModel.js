const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const messageshema = new mongoose.Schema({
    chatId : String,
    senderId : String,
    text : String,
},
{ timestamps: true }
)
const messageModel = mongoose.model("Message" ,messageshema );
module.exports = messageModel;