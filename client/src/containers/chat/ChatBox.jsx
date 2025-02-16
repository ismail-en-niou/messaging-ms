import { useContext, useRef, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { UserContext } from "../../context/UserContext";
import useFetchRecipient from "../../hooks/useFetchRecipient";
import moment from "moment";

const ChatBox = () => {
  const { user } = useContext(UserContext);
  const { currentChat, messages, isMessageLoading, sendMessage, onlineUsers } =
    useContext(ChatContext);
  const { recipientUser } = useFetchRecipient(currentChat, user);
  const [textMessage, setTextMessage] = useState("");
  
  // Refs for scrolling and input focus
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if recipient is online
  const is_online = onlineUsers?.some((usr) => usr?.userId === recipientUser?._id);

  // Function to handle sending messages
  const handleSendMessage = () => {
    if (textMessage.trim() === "") return;
    sendMessage(textMessage, user, currentChat._id, setTextMessage);
    setTextMessage(""); // Reset input
    setTimeout(scrollToBottom, 100); // Ensure smooth scrolling
  };

  // Handle Enter key press to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-focus on input when chat is opened
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [currentChat]);

  // Show a placeholder if no chat is selected
  if (!recipientUser) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No conversation selected yet...
      </div>
    );
  }

  // Show loading message while fetching chat data
  if (isMessageLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[90vh] w-full bg-gray-100 dark:bg-gray-900">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 shadow-md">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div>
          <p className="font-semibold text-gray-800 dark:text-white">
            {recipientUser.username}
          </p>
          <p className={`text-sm ${is_online ? "text-green-500" : "text-red-500"}`}>
            {is_online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.senderId === user._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  message.senderId === user._id
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                <p>{message.text}</p>
                <span className="text-xs block text-gray-500 mt-1 text-right">
                  {moment(message.createdAt).format("LT")}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No messages to display</p>
        )}
        {/* Invisible div for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white dark:bg-gray-800 shadow-md flex items-center gap-2">
        <input
          type="text"
          ref={inputRef}
          autoComplete="off"
          placeholder="Type a message..."
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          onKeyDown={handleKeyDown} // Detect "Enter" key
          className="flex-1 p-2 border rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="p-2 bg-blue-500 text-white rounded-full"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
