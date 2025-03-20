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
    <Container className="h-full w-full" maxWidth="xl">
      <Stack
        direction={{ xs: "column", md: "row" }} // Stack vertically on small screens, horizontally on medium and up
        spacing={2}
        className="h-full"
      >
        {/* Chat List Sidebar */}
        <Box
          sx={{
            width: { xs: "100%", md: 350 }, // Full width on small screens, 350px on medium and up
            maxHeight: "100vh",
            overflowY: "auto",
            borderRadius: 1,
          }}
          className="pe-3"
        >
          {isUserChatLoding ? (
            <p>Loading chats...</p>
          ) : chats.length === 0 ? (
            <p className="text-center text-gray-500">No chats available</p>
          ) : (
            chats.map((chat) => (
              <UserChatWrapper
                key={chat._id}
                chat={chat}
                user={user}
                updateCurentChat={updateCurentChat}
              />
            ))
          )}
        </Box>

        {/* Chat Window */}
        <Box
          sx={{
            flex: 1,
            maxHeight: "100vh",
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <ChatBox />
        </Box>
      </Stack>
    </Container>
  );
}

const UserChatWrapper = ({ chat, user, updateCurentChat }) => {
  const { recipientUser } = useFetchRecipient(chat, user);

  return (
    <div
      onClick={() => updateCurentChat(chat)}
      className="cursor-pointer rounded-md"
    >
      <Userchat chat={chat} user={recipientUser} />
    </div>
  );
};
