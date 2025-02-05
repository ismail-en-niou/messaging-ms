const chatModel = require("../modules/chatModel");

// Create Chat
const create = async (req, res) => {
    const { firstId, secondId } = req.body; // Corrected to use consistent casing
    try {
        if (!firstId || !secondId)
            res.status(404).json({ message: "Failed to create chat , invalid args "});
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] }, // Fixed $all usage
        });

        if (chat) {
            return res.status(200).json(chat);
        }

        // Create a new chat if not found
        const newChat = new chatModel({
            members: [firstId, secondId], // Ensure members is an array
        });
        const response = await newChat.save();
        res.status(200).json(response);
    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).json({ message: "Failed to create chat", error });
    }
};

// Get User Chats
const findUserChat = async (req, res) => {
    const { userId } = req.params; // Fixed destructuring
    try {
        const chats = await chatModel.find({
            members: { $in: [userId] }, // Query for chats where userId is in members array
        });
        res.status(200).json(chats);
    } catch (error) {
        console.error("Error fetching user chats:", error);
        res.status(500).json({ message: "Failed to fetch user chats", error });
    }
};

// Find Chat Between Two Users
const findChat = async (req, res) => {
    const { firstId, secondId } = req.params; // Use consistent casing
    try {
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] }, // Fixed $all usage
        });
        // console.log(chat);
        res.status(200).json(chat);
    } catch (error) {
        console.error("Error finding chat:", error);
        res.status(500).json({ message: "Failed to find chat", error });
    }
};

module.exports = { create, findUserChat, findChat };
