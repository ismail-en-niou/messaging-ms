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
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the messages when they are updated
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if the recipient is online
  const is_online = onlineUsers?.some((usr) => usr?.userId === recipientUser?._id);

  // Handle sending a message
  const handleSendMessage = () => {
    if (textMessage.trim() === "") return;
    sendMessage(textMessage, user, currentChat._id, setTextMessage);
    setTextMessage("");
    setTimeout(scrollToBottom, 100);
  };

  // Handle "Enter" key to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Focus input when chat is selected
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [currentChat]);

  // Format time like WhatsApp
  const formatTime = (timestamp) => {
    const now = moment();
    const messageTime = moment(timestamp);
    
    if (now.diff(messageTime, 'days') === 0) {
      return messageTime.format('HH:mm');
    } else if (now.diff(messageTime, 'days') === 1) {
      return 'Yesterday';
    } else if (now.diff(messageTime, 'days') < 7) {
      return messageTime.format('dddd');
    } else {
      return messageTime.format('DD/MM/YYYY');
    }
  };

  // Group messages by date - Fixed with proper array checking
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    // Check if messages is an array and has items
    if (!Array.isArray(messages) || messages.length === 0) {
      return groups;
    }
    
    messages.forEach(message => {
      // Ensure message exists and has createdAt
      if (message && message.createdAt) {
        const date = moment(message.createdAt).format('YYYY-MM-DD');
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(message);
      }
    });
    return groups;
  };

  // Safely get message groups
  const messageGroups = groupMessagesByDate(messages);

  // If no recipient, show WhatsApp-like placeholder
  if (!recipientUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#f0f2f5] dark:bg-[#111b21]">
        <div className="text-center p-8">
          <div className="w-64 h-64 mx-auto mb-6 opacity-20">
            <svg viewBox="0 0 303 172" className="w-full h-full fill-current text-[#54656f]">
              <path d="M113.5 160.5H189.5V149H113.5V160.5Z"/>
              <path d="M113.5 133H189.5V121.5H113.5V133Z"/>
              <path d="M113.5 105.5H189.5V94H113.5V105.5Z"/>
              <circle cx="61.5" cy="115.5" r="21"/>
              <circle cx="241.5" cy="115.5" r="21"/>
              <path d="M61.5 94.5C50.73 94.5 42 103.23 42 114V117C42 127.77 50.73 136.5 61.5 136.5S81 127.77 81 117V114C81 103.23 72.27 94.5 61.5 94.5Z"/>
              <path d="M241.5 94.5C230.73 94.5 222 103.23 222 114V117C222 127.77 230.73 136.5 241.5 136.5S261 127.77 261 117V114C261 103.23 252.27 94.5 241.5 94.5Z"/>
            </svg>
          </div>
          <h3 className="text-[#41525d] dark:text-[#8696a0] text-2xl font-light mb-2">
            WhatsApp Web
          </h3>
          <p className="text-[#667781] dark:text-[#8696a0] text-sm max-w-md">
            Send and receive messages without keeping your phone online.
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
        </div>
      </div>
    );
  }

  // Show loading message while fetching data
  if (isMessageLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#f0f2f5] dark:bg-[#111b21]">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-[#00a884] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[#667781] dark:text-[#8696a0]">Loading messages...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#efeae2] dark:bg-[#0b141a] relative">
      {/* WhatsApp Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='42' height='58' viewBox='0 0 42 58' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M12 18h12v12H12V18zm6-6h12v12H18V12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Chat Header - WhatsApp Style */}
      <div className="flex items-center gap-3 p-4 bg-[#f0f2f5] dark:bg-[#202c33] border-l border-[#d1d7db] dark:border-[#313d44] relative z-10">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-[#6b7c85] flex items-center justify-center text-white">
            <span className="text-lg font-medium">
              {recipientUser.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          {is_online && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00a884] border-2 border-white dark:border-[#202c33]"></span>
          )}
        </div>
        <div className="flex-1">
          <p className="font-medium text-[#111b21] dark:text-[#e9edef] text-base">
            {recipientUser.username}
          </p>
          <p className="text-xs text-[#667781] dark:text-[#8696a0]">
            {is_online ? "online" : `last seen ${formatTime(recipientUser.lastSeen || new Date())}`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* WhatsApp Header Icons */}
          <button className="p-2 rounded-full hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" className="fill-[#54656f] dark:fill-[#8696a0]">
              <path d="M15.9 14.3H15L14.7 14C15.8 12.8 16.3 11.1 16.3 9.5C16.3 5.9 13.4 3 9.8 3S3.3 5.9 3.3 9.5S6.2 16 9.8 16C11.4 16 12.9 15.4 14.1 14.4L14.4 14.7V15.3L19.8 20.7L21.2 19.3L15.9 14.3ZM9.8 14C7.3 14 5.3 12 5.3 9.5S7.3 5 9.8 5S14.3 7 14.3 9.5S12.3 14 9.8 14Z"/>
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" className="fill-[#54656f] dark:fill-[#8696a0]">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 relative z-10">
        {Object.keys(messageGroups).length > 0 ? (
          Object.keys(messageGroups).map(date => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex justify-center my-4">
                <div className="bg-[#e9edef] dark:bg-[#182229] px-3 py-1 rounded-md shadow-sm">
                  <span className="text-xs text-[#667781] dark:text-[#8696a0] font-medium">
                    {moment(date).calendar(null, {
                      sameDay: '[Today]',
                      lastDay: '[Yesterday]',
                      lastWeek: 'dddd',
                      sameElse: 'DD/MM/YYYY'
                    })}
                  </span>
                </div>
              </div>

              {/* Messages for this date */}
              {messageGroups[date].map((message, index) => {
                const isOwnMessage = message.senderId === user._id;
                const nextMessage = messageGroups[date][index + 1];
                const prevMessage = messageGroups[date][index - 1];
                
                const isLastInGroup = !nextMessage || nextMessage.senderId !== message.senderId;
                const isFirstInGroup = !prevMessage || prevMessage.senderId !== message.senderId;
                
                return (
                  <div
                    key={message._id || index}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-1`}
                  >
                    <div
                      className={`relative max-w-[65%] min-w-[100px] px-3 py-2 shadow-sm ${
                        isOwnMessage
                          ? "bg-[#d9fdd3] dark:bg-[#005c4b] ml-12"
                          : "bg-white dark:bg-[#202c33] mr-12"
                      } ${
                        isFirstInGroup && isLastInGroup
                          ? "rounded-lg"
                          : isFirstInGroup
                          ? isOwnMessage
                            ? "rounded-lg rounded-br-md"
                            : "rounded-lg rounded-bl-md"
                          : isLastInGroup
                          ? isOwnMessage
                            ? "rounded-lg rounded-tr-md"
                            : "rounded-lg rounded-tl-md"
                          : isOwnMessage
                          ? "rounded-lg rounded-r-md"
                          : "rounded-lg rounded-l-md"
                      }`}
                    >
                      <p className={`text-sm ${
                        isOwnMessage 
                          ? "text-[#111b21] dark:text-[#e9edef]" 
                          : "text-[#111b21] dark:text-[#e9edef]"
                      } break-words`}>
                        {message.text}
                      </p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${
                        isOwnMessage ? "ml-4" : "ml-8"
                      }`}>
                        <span className="text-[11px] text-[#667781] dark:text-[#8696a0]">
                          {moment(message.createdAt).format("HH:mm")}
                        </span>
                        {isOwnMessage && (
                          <svg width="16" height="11" viewBox="0 0 16 11" className="fill-[#53bdeb]">
                            <path d="M11.071.653a.9.9 0 0 0-1.272 0l-5.68 5.68L1.62 3.834a.9.9 0 1 0-1.273 1.273l3.135 3.135a.9.9 0 0 0 1.273 0L11.071 1.926a.9.9 0 0 0 0-1.273z"/>
                            <path d="M15.071.653a.9.9 0 0 0-1.272 0l-5.68 5.68-1.498-1.499a.9.9 0 1 0-1.273 1.273l2.135 2.135a.9.9 0 0 0 1.273 0L15.071 1.926a.9.9 0 0 0 0-1.273z"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-[#667781] dark:text-[#8696a0] text-sm">
              {Array.isArray(messages) && messages.length === 0 
                ? "No messages yet. Start the conversation!" 
                : "Loading messages..."}
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - WhatsApp Style */}
      <div className="p-4 bg-[#f0f2f5] dark:bg-[#202c33] border-l border-[#d1d7db] dark:border-[#313d44] relative z-10">
        <div className="flex items-end gap-3">
          {/* Emoji/Attachment button */}
          <button className="p-2 rounded-full hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" className="fill-[#54656f] dark:fill-[#8696a0]">
              <path d="M9.153 11.603c.795 0 1.44-.88 1.44-1.962s-.645-1.96-1.44-1.96c-.795 0-1.44.88-1.44 1.96s.645 1.965 1.44 1.965zM14.847 11.603c.795 0 1.44-.88 1.44-1.962s-.645-1.96-1.44-1.96c-.795 0-1.44.88-1.44 1.96s.645 1.965 1.44 1.965z"/>
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
              <path d="M12 17.493c2.75 0 5.117-1.691 6.115-4.09a.995.995 0 0 0-.398-1.342.994.994 0 0 0-1.341.398A4.98 4.98 0 0 1 12 15.493a4.98 4.98 0 0 1-4.376-2.034.994.994 0 0 0-1.341-.398.995.995 0 0 0-.398 1.342C7.883 15.802 10.25 17.493 12 17.493z"/>
            </svg>
          </button>

          {/* Input container */}
          <div className="flex-1 relative">
            <input
              type="text"
              ref={inputRef}
              autoComplete="off"
              placeholder="Type a message"
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-3 pr-12 bg-white dark:bg-[#2a3942] text-[#111b21] dark:text-[#e9edef] rounded-lg border-none outline-none placeholder-[#667781] dark:placeholder-[#8696a0] text-sm"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-[#f5f6f6] dark:hover:bg-[#374045] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" className="fill-[#54656f] dark:fill-[#8696a0]">
                <path d="M15.172 7l-6.586 6.586-1.414-1.414L13.758 5.586 15.172 7z"/>
                <path d="M17.5 13.5c.828 0 1.5.672 1.5 1.5v4c0 .828-.672 1.5-1.5 1.5h-11c-.828 0-1.5-.672-1.5-1.5v-11c0-.828.672-1.5 1.5-1.5h11c.828 0 1.5.672 1.5 1.5v4z"/>
              </svg>
            </button>
          </div>

          {/* Send button */}
          {textMessage.trim() ? (
            <button
              onClick={handleSendMessage}
              className="p-3 bg-[#00a884] hover:bg-[#008f72] text-white rounded-full transition-all duration-200 transform hover:scale-105"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          ) : (
            <button className="p-3 rounded-full hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" className="fill-[#54656f] dark:fill-[#8696a0]">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H11V21H5V3H13V9H21Z"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBox;