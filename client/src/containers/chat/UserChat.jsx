import React, { useContext, useEffect, useState } from "react";
import userfetch from "../../hooks/userftech";
import { Stack, Typography, Avatar, Badge } from "@mui/material";
import { ChatContext } from "../../context/ChatContext";

export default function UserChat({ Chat, user }) {
  const { recipientUser } = userfetch(Chat, user);
  const [userschat, setUserChat] = useState(null);
  const { onlineUsers, updateCurentChat } = useContext(ChatContext);
  
  useEffect(() => {
    setUserChat(recipientUser);
  }, [recipientUser]);

  // Check if the user is online
  const is_online = onlineUsers?.some((usr) => usr?.userId === recipientUser?._id);

  // Sample message preview - ideally this will be dynamic based on actual chat history
  const messagePreview = "Hey"; // This should be dynamic (last message in the chat)

  // Dynamic last seen - can be replaced with actual data
  const lastSeen = new Date().toLocaleDateString('en-GB'); // Format as DD/MM/YYYY

  // Unread message count (replace with actual unread count from the chat)
  const unreadCount = 2;

  // Generate consistent avatar color based on username
  const getAvatarColor = (username) => {
    const colors = [
      "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3",
      "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a",
      "#cddc39", "#ffc107", "#ff9800", "#ff5722", "#795548"
    ];
    
    if (!username) return "#00bd9b";
    
    const hash = username.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Handle chat click
  const handleChatClick = () => {
    if (updateCurentChat && Chat) {
      updateCurentChat(Chat);
    }
  };

  // Format time for WhatsApp style
  const formatTime = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
    return dateString;
  };

  return (
    <div
      onClick={handleChatClick}
      className="w-full p-4 bg-white dark:bg-[#202c33] hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] cursor-pointer transition-all duration-200 border-b border-gray-100 dark:border-[#313d44] group"
    >
      <Stack direction="row" spacing={3} alignItems="center" className="w-full">
        {/* Avatar Section */}
        <div className="relative flex-shrink-0">
          <Avatar 
            sx={{ 
              width: 50, 
              height: 50,
              backgroundColor: getAvatarColor(recipientUser?.username),
              fontSize: '1.25rem',
              fontWeight: 500
            }}
          >
            {recipientUser?.username?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase()}
          </Avatar>

          {/* Online indicator */}
          {is_online && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#00a884] rounded-full border-2 border-white dark:border-[#202c33]"></div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <Typography 
              variant="h6" 
              className="font-medium text-[#111b21] dark:text-[#e9edef] truncate"
              sx={{ fontSize: '1rem', fontWeight: 500 }}
            >
              {recipientUser?.username || user?.username || "Unknown User"}
            </Typography>
            
            {/* Timestamp */}
            <Typography 
              variant="caption" 
              className="text-[#667781] dark:text-[#8696a0] flex-shrink-0 ml-2"
              sx={{ fontSize: '0.75rem' }}
            >
              {formatTime(lastSeen)}
            </Typography>
          </div>
          
          <div className="flex items-center justify-between">
            {/* Message preview */}
            <Typography 
              variant="body2" 
              className={`truncate flex-1 ${
                unreadCount > 0 
                  ? "text-[#111b21] dark:text-[#e9edef] font-medium" 
                  : "text-[#667781] dark:text-[#8696a0]"
              }`}
              sx={{ fontSize: '0.875rem' }}
            >
              {messagePreview}
            </Typography>
            
            {/* Status and Unread Section */}
            <div className="flex items-center space-x-2 ml-2">
              {/* Message status (delivered/read) */}
              <div className="flex items-center">
                <svg width="16" height="11" viewBox="0 0 16 11" className="fill-[#53bdeb]">
                  <path d="M11.071.653a.9.9 0 0 0-1.272 0l-5.68 5.68L1.62 3.834a.9.9 0 1 0-1.273 1.273l3.135 3.135a.9.9 0 0 0 1.273 0L11.071 1.926a.9.9 0 0 0 0-1.273z"/>
                  <path d="M15.071.653a.9.9 0 0 0-1.272 0l-5.68 5.68-1.498-1.499a.9.9 0 1 0-1.273 1.273l2.135 2.135a.9.9 0 0 0 1.273 0L15.071 1.926a.9.9 0 0 0 0-1.273z"/>
                </svg>
              </div>

              {/* Unread count badge */}
              {unreadCount > 0 && (
                <div className="bg-[#00a884] text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </Stack>

      {/* Online status indicator (small dot) */}
      {is_online && (
        <div className="absolute top-4 left-16">
          <div className="w-2 h-2 bg-[#00a884] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </div>
      )}
    </div>
  );
}