import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { UserContext } from "../../context/UserContext";
import useFetchRecipient from "../../hooks/useFetchRecipient";
import moment from "moment";

const ChatBox = () => {
  const { user } = useContext(UserContext);
  const { currentChat, messages, isMessageLoading } = useContext(ChatContext);
  const { recipientUser } = useFetchRecipient(currentChat, user);

  if (!recipientUser) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No conversation selected yet...
      </div>
    );
  }

  if (isMessageLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-gray-100 dark:bg-gray-900">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 shadow-md">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div>
          <p className="font-semibold text-gray-800 dark:text-white">{recipientUser.username}</p>
          <p className="text-sm text-green-500">Online</p>
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
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white dark:bg-gray-800 shadow-md flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none"
        />
        <button className="p-2 bg-blue-500 text-white rounded-full">➤</button>
      </div>
    </div>
  );
};

export default ChatBox;
