import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getfetch, postfetch } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatLoding, setIsUserChatLoding] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat , setCurrentChat] = useState({});
  const [messages , setMessages] = useState({});
  const [isMessageLoading , setIsMessageLoading] = useState(false);
  const [messagesError , setMessageError] = useState(null);
  const [sendMessageError , setSendMessageError] = useState(null);
  const [newMessage , setNewMessage] = useState(null);
  // console.log("currentChat",currentChat);
  // console.log("message", message)
  useEffect(() => {
    const getUsers = async () => {
      const response = await getfetch(`${baseUrl}/users`);
      if (response.error) {
        return console.log("Error fetching users", response);
      }

      const pChat = response.filter((u) => {
        if (user?._id === u._id) return false;
        let isChatCreated = false;
        if (userChats) {
          isChatCreated = userChats.some((chat) => {
            return (
              chat.members[0] === u._id || 
              chat.members[1] === u._id
            );
          });
        }
        return !isChatCreated;
      });

      setPotentialChats(pChat);
    };

    getUsers();
  }, [userChats, user?._id]);

  // get chats 

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatLoding(true);
        setUserChatsError(null);

        const response = await getfetch(`${baseUrl}/chat/user/${user._id}`);
        if (response.error) {
          setUserChatsError(response);
        } else {
          setUserChats(response);
        }

        setIsUserChatLoding(false);
      }
    };

    getUserChats();
  }, [user?._id]);

  // get messages 

  useEffect(() => {
    const getMessage = async () => {
        setIsMessageLoading(true);
        setMessageError(null);
        // console.log("current chat id",currentChat._id);
        const response = await getfetch(`${baseUrl}/messages/${currentChat?._id}`);
        // console.log("response",response);
        if (response.error) {
          setMessageError(response);
        } else {
          setMessages(response);
        }
        setIsMessageLoading(false);
    };

    getMessage();
  }, [currentChat , newMessage]);

  const sendMessage = useCallback(async (textMessage , sender , currentChatId , setTextMessage) => {
   
    if (!textMessage) return console.log("Message cannot be empty");
    console.log("currentChatId",currentChatId);
    console.log("sender",sender._id);
    console.log("textMessage",textMessage);

    const resp = await postfetch(
      `${baseUrl}/messages/`,
      {
        chatId: currentChatId,
        senderId: sender._id,
        text: textMessage,
      }
    );
    console.log("resp",resp);
    if (resp.error) {
      setSendMessageError(resp);
    } else {
      setTextMessage("");
      setMessages((prev) => (prev ? [...prev, resp] : [resp]));
      setNewMessage(resp);
    }
  }, []);

  const updateCurentChat = useCallback((chat)=>{
    // console.log("hada chat ",chat)
    setCurrentChat(chat);
  },[])

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postfetch(`${baseUrl}/chat/create`, {
      firstId,
      secondId,
    });
    if (response.error) {
      return console.log("Error creating chat", response);
    }
    setUserChats((prev) => (prev ? [...prev, response] : [response]));
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatLoding,
        userChatsError,
        potentialChats,
        createChat,
        updateCurentChat,
        messages,
        isMessageLoading,
        messagesError,
        currentChat,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};