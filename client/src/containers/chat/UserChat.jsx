import React, { useContext, useEffect, useState } from "react";
import userfetch from "../../hooks/userftech";
import { Stack, Typography, Avatar, Badge } from "@mui/material";
import { ChatContext } from "../../context/ChatContext";

export default function UserChat({ Chat, user }) {
  const { recipientUser } = userfetch(Chat, user);
  const [userschat, setUserChat] = useState(null);
  const { onlineUsers } = useContext(ChatContext);

  useEffect(() => {
    setUserChat(recipientUser);
  }, [recipientUser]);

  // Check if the user is online
  const is_online = onlineUsers?.some((usr) => usr?.userId === user?._id);

  // Sample message preview - ideally this will be dynamic based on actual chat history
  const messagePreview = "Hey"; // This should be dynamic (last message in the chat)

  // Dynamic last seen - can be replaced with actual data
  const lastSeen = new Date().toLocaleDateString('en-GB'); // Format as DD/MM/YYYY


  // Unread message count (replace with actual unread count from the chat)
  const unreadCount = 2;

  return (
    <Stack
      direction="row"
      className="w-full p-4 bg-[#2a2a2a] rounded-lg shadow-md mb-3 hover:bg-[#3a3a3a] cursor-pointer transition-all duration-300 ease-in-out"
      gap={2}
    >
      <div className="relative flex items-center space-x-4">
        {/* Avatar and Online indicator */}
        <Avatar sx={{ width: 50, height: 50 }} className="bg-[#00bd9b]">
          {user?.username?.charAt(0).toUpperCase()}
        </Avatar>

        {/* Online indicator */}
        {is_online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></span>
        )}
      </div>

      {/* User's Name and Message Preview */}
      <div className="flex flex-col w-full">
        <Typography className="font-semibold text-white">{user?.username}</Typography>

        {/* Last message preview */}
        <Typography className="text-gray-400 text-sm">{messagePreview}</Typography>
      </div>

      {/* Right section: Last seen, Unread message badge */}
      <div className="flex flex-col ml-4 items-end justify-between">
        {/* Last seen */}
        <Typography className="text-sm font-bold text-gray-500">{lastSeen}</Typography>

        {/* Unread messages badge */}
        {unreadCount > 0 && (
          <Badge
            badgeContent={unreadCount}
            color="primary"
            sx={{
              backgroundColor: "#00bd9b",
            }}
          />
        )}
      </div>
    </Stack>
  );
}
