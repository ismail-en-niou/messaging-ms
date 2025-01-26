const messageModel = require("../modules/messageModel");

// create chat 

const createChat = async (req , res) =>{
    const {chatId , senderId , text} = req.body;
    // create a message model to use if not exist 
    const message = new messageModel({chatId , senderId , text});
    try {
       const response = await message.save();
       res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json( error );
    }
};

//get chat 
const getChat = async (req , res )=>{
    const {chatId} = req.params;
    try {
        const chat = await messageModel.find({chatId});
        res.status(200).json(chat);
    } catch (error) {
        console.log(error);
        res.status(500).json( error );
    }
};

module.exports = {createChat , getChat};