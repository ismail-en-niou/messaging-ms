const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Corrected the typo: "chatChema" to "chatSchema"
let chatSchema = new Schema(
    {
        members: [String], // Specify the type of elements in the array for better clarity
    },
    { timestamps: true } // Ensure correct spacing and casing
);

const chatModel = mongoose.model("Chat", chatSchema); // Consistent casing for model name
module.exports = chatModel;
