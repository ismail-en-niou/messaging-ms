const MessageModel = require("../modules/messageModel");

// Create a chat message
const createChat = async (req, res) => {
    try {
        const { chatId, senderId, text } = req.body;

        // Validate request body
        if (!chatId || !senderId || !text) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Create a new message
        const message = new MessageModel({ chatId, senderId, text });

        // Save message to database
        const savedMessage = await message.save();
        res.status(201).json(savedMessage);

    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get chat messages by chatId
const getChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        if (!chatId) {
            return res.status(400).json({ error: "Chat ID is required." });
        }

        const chatMessages = await MessageModel.find({ chatId });

        if (!chatMessages.length) {
            return res.status(404).json({ message: "No messages found for this chat." });
        }

        res.status(200).json(chatMessages);

    } catch (error) {
        console.error("Error fetching chat:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { createChat, getChat };
