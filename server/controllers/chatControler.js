const chatModel = require("../modules/chatModel");
// create chat 
const create = async (req , res )=>{
    const {firstid , secondId} = req.body;
    try{
        const chat = await chatModel.findOne(
            {
                members :{$all:[{firstid , secondId}]}
            }
        );
        if (chat)
            return res.statu(200).json(chat);
        
            const newChat= new chatModel({
                members : {firstid , secondId}
            })
        const response = await newChat.save();
        res.status(200).json(response);
    }catch(error)
    {
        console.log(error);
        res.status(500).json(error);
    }
}
//getuserchat 

const findUserChat = async (req , res) => {
    const {userId} = req.params.userId;
    try {
        const chats = await chatModel.find(
            {
                members : {$in: [userId]}
            }
        )
        res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

//find chat 

const findChat = async (req , res) => {
    const { firstId , secondId } = req.params;
    try {
        const chat = await chatModel.findOne(
            {members :{$all:[{firstId , secondId}]}}
        );
        res.status(200).json(chat);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports = {create , findUserChat , findChat};