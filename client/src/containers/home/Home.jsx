import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ChatContext } from "../../context/ChatContext";
import { Container, Stack } from "@mui/material";
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

  // ✅ Ensure `userChats` is always an array
  const chats = userChats || [];

  return (
    <Container className="h-full">
      {chats.length === 0 ? (
        <p>No chats available.</p>
      ) : (
        <Stack direction="row" className="h-full ">
          <Stack className="h-full pe-3">
            {isUserChatLoding && <p>Loading chats...</p>}
            {chats.map((chat) => (
              <UserChatWrapper key={chat._id} chat={chat} user={user} updateCurentChat={updateCurentChat} />
            ))}
          </Stack>
          <ChatBox />
        </Stack>
      )}
    </Container>
  );
}

const UserChatWrapper = ({ chat, user, updateCurentChat }) => {
  const {recipientUser} = useFetchRecipient(chat, user);
  return (
    <div onClick={() => updateCurentChat(chat)}>
      <Userchat chat={chat} user={recipientUser} />
    </div>
  );
};
