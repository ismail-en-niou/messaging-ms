import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ChatContext } from "../../context/ChatContext"; // ✅ Ensure correct import
import { Container, Stack } from "@mui/material"; // ✅ Ensure these components exist
import Userchat from "../chat/UserChat"; // ✅ Ensure correct import
import { UserContext } from "../../context/UserContext";

export default function Home() {
  const navigate = useNavigate();
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const { userChats, isUserChatLoding, userChatsError } = useContext(ChatContext);
  const { user } = useContext(UserContext);

  console.log("Context value:", userChats); // ✅ Debugging log


  return (
    <Container>
      {userChats?.length < 1 ? null :( 
        <Stack direction="horizontal" gap={4} className="align-items-center">
          <Stack className="messages-box flexe-grow-0 pe-3" gap={3}>
            {!isUserChatLoding && <p>Loading chats...</p>}
            {userChats?.map((chat , index) => (
              <div key={index} className="message">
                <Userchat chat={chat} user={user}/>
              </div>
            ))}
          </Stack>
          <p>chatBox</p>
        </Stack>
      )}
    </Container>
  );
}

