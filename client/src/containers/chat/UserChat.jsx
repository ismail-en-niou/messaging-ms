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

  return (
    <Stack
      direction="row"
      className="w-full p-4 bg-[#2a2a2a] rounded-lg shadow-md mb-3 hover:bg-[#3a3a3a] cursor-pointer transition-all duration-300 ease-in-out"
      gap={4}
    >
      <div className="flex items-center space-x-8">
        {/* Avatar */}
        <Avatar sx={{ width: 50, height: 50 }} className="bg-[#00bd9b]">
          {user?.username?.charAt(0)}
        </Avatar>

        {/* Online indicator */}
        
        <div className="flex flex-col w-full">
          {/* User's name */}
          <Typography className="font-semibold text-white">{user?.username}</Typography>
          {/* Last message preview */}
          <p className="text-gray-400">message</p>
        </div>
      </div>

      <div className="flex flex-col ml-4 items-end justify-between">
        {/* Last seen date */}
        <Typography className="text-sm font-bold text-gray-500">12/12/2022</Typography>

        {/* Unread messages badge */}
        <div className="relative">
          <Badge
            badgeContent={1}
            color="primary"
            sx={{
              marginTop: "10px",
              backgroundColor: "#00bd9b",
            }}
          />
        </div>
        <div className="relative">
        {is_online && (
            <span className="absolute top-[-50px] left-6 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></span>
          )}
      </div>
        </div>
    </Stack>
  );
}
