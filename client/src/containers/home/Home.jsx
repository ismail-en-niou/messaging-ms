import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ChatContext } from "../../context/ChatContext";
import { Container, Stack, Box } from "@mui/material";
import Userchat from "../chat/UserChat";
import { UserContext } from "../../context/UserContext";
import ChatBox from "../chat/ChatBox";
import useFetchRecipient from "../../hooks/useFetchRecipient";

export default function Home() {
  const navigate = useNavigate();
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const { userChats, isUserChatLoding, updateCurentChat } = useContext(ChatContext);
  const { user } = useContext(UserContext);

  // Ensure `userChats` is always an array
  const chats = userChats || [];

  return (
    <div className="h-screen bg-[#f0f2f5] dark:bg-[#111b21] flex">
      <Container className="h-full w-full p-0" maxWidth="xl">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={0}
          className="h-full"
        >
          {/* Chat List Sidebar - WhatsApp Style */}
          <Box
            sx={{
              width: { xs: "100%", md: 400 },
              maxHeight: "100vh",
              borderRadius: 0,
              backgroundColor: "white",
              borderRight: "1px solid #d1d7db"
            }}
            className="flex flex-col dark:bg-[#111b21] dark:border-[#313d44]"
          >
            {/* Sidebar Header */}
            <div className="bg-[#f0f2f5] dark:bg-[#202c33] p-4 border-b border-gray-200 dark:border-[#313d44]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#6b7c85] flex items-center justify-center text-white">
                    <span className="text-lg font-medium">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h1 className="text-xl font-semibold text-[#111b21] dark:text-[#e9edef]">
                    Chats
                  </h1>
                </div>
                
                {/* Header Actions */}
                <div className="flex items-center space-x-2">
                  {/* New Chat Icon */}
                  <button className="p-2 rounded-full hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" className="fill-[#54656f] dark:fill-[#8696a0]">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                      <path d="M13 11h-2V9h2v2zm0 4h-2v-2h2v2z"/>
                    </svg>
                  </button>

                  {/* Menu Icon */}
                  <button className="p-2 rounded-full hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" className="fill-[#54656f] dark:fill-[#8696a0]">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mt-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" className="fill-[#667781] dark:fill-[#8696a0]">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search or start new chat"
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#2a3942] border border-gray-200 dark:border-[#313d44] rounded-lg text-[#111b21] dark:text-[#e9edef] placeholder-[#667781] dark:placeholder-[#8696a0] text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884] focus:border-transparent"
                />
              </div>
            </div>

            {/* Chat List Content */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                {isUserChatLoding ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border-2 border-[#00a884] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[#667781] dark:text-[#8696a0]">Loading chats...</span>
                    </div>
                  </div>
                ) : chats.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 p-8">
                    <div className="w-24 h-24 mb-6 opacity-20">
                      <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#667781] dark:text-[#8696a0]">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                      </svg>
                    </div>
                    <h3 className="text-[#41525d] dark:text-[#8696a0] text-lg font-medium mb-2">
                      No chats yet
                    </h3>
                    <p className="text-[#667781] dark:text-[#8696a0] text-sm text-center max-w-xs mb-4">
                      Start a conversation by sending a message to someone in your contacts.
                    </p>
                    <button className="px-4 py-2 bg-[#00a884] hover:bg-[#008f72] text-white rounded-lg transition-colors">
                      Start New Chat
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-[#313d44]">
                    {chats.map((chat) => (
                      <UserChatWrapper
                        key={chat._id}
                        chat={chat}
                        user={user}
                        updateCurentChat={updateCurentChat}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Box>

          {/* Chat Window */}
          <Box
            sx={{
              flex: 1,
              maxHeight: "100vh",
              borderRadius: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              backgroundColor: "#efeae2",
            }}
            className="dark:bg-[#0b141a]"
          >
            <ChatBox />
          </Box>
        </Stack>
      </Container>
    </div>
  );
}

const UserChatWrapper = ({ chat, user, updateCurentChat }) => {
  const { recipientUser } = useFetchRecipient(chat, user);

  return (
    <div
      onClick={() => updateCurentChat(chat)}
      className="cursor-pointer hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] transition-colors duration-200"
    >
      <Userchat chat={chat} user={recipientUser} />
    </div>
  );
};