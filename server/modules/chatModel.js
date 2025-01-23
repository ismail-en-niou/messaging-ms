const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let chatChema = new Schema(
    {
        members : Array,
    },
    {timestamps : true}
);
const chatmodel = mongoose.model("chat" , chatChema);
module.exports = chatmodel;