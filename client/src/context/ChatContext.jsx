import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getfetch, postfetch } from "../utils/services";
import {io, Socket} from "socket.io-client"

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatLoding, setIsUserChatLoding] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat , setCurrentChat] = useState({});
  const [messages , setMessages] = useState([]);
  const [isMessageLoading , setIsMessageLoading] = useState(false);
  const [messagesError , setMessageError] = useState(null);
  const [sendMessageError , setSendMessageError] = useState(null);
  const [newMessage , setNewMessage] = useState(null);
  const [socket , setSoket] = useState(null);
  const [onlineUsers , setOnlineUsers] = useState(null);
  const [notifications , setNotification] = useState([]);
  const [allUsers , setAllusers]  = useState([]);
  let link = "http://socket.mandomati.com/";


  // initial socket 
  useEffect(()=>{
    const newSocket = io(link,{
      transports: ["websocket"],
    });
    setSoket(newSocket);
    return () =>{
      newSocket.disconnect();
    }
  },[user]);

  useEffect(() => {
    if (!socket || !user?._id) return;
  
    // console.log("🔗 Adding new user:", user._id);
    socket.emit("addNewUser", user._id);

    socket.on("updateOnlineUsers", (res) => {
      // console.log("👥 Online Users:", res);
      setOnlineUsers(res);
    });
  
    return () => {
      socket.off("updateOnlineUsers");
    };
  }, [socket, user?._id]);
  
  // send message 
  useEffect(() => {
    if (!socket || !user?._id || !newMessage) return;
    // console.log("📨 Sending new message:", newMessage);
    const recipientId = currentChat.members.find((member) => member !== user?._id);
    socket.emit("sendMessage", {...newMessage , recipientId});


  }, [newMessage, socket, user?._id]);
  


  useEffect(() => {
    if (!socket) return;
  
    const handleMessage = (message) => {
      if (currentChat?._id === message.chatId) {
        setMessages((prev) => [...prev, message]);
      }
    };
  
    const handleNotification = (res) => {
      const isChatOpen = currentChat?.members?.some((id) => id === res.senderId);
      setNotification((prev) => {
        // If the chat is open, mark notification as read
        return isChatOpen
          ? [{ ...res, isRead: true }, ...prev]
          : [{ ...res, isRead: false }, ...prev];
      });
    };
    
  
    socket.on("getMessage", handleMessage);
    socket.on("getNotification", handleNotification);
  
    return () => {
      socket.off("getMessage", handleMessage);
      socket.off("getNotification", handleNotification);
    };
  }, [socket, currentChat]);
  


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
    const getAllUsers = async () => {
      const response = await getfetch(`${baseUrl}/users`);
      setAllusers(response);
    };
    getAllUsers();
  }, []);


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
      setMessages((prev) => (Array.isArray(prev) ? [...prev, resp] : [resp]));
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
    if (response) {
      setUserChats((prev) => (Array.isArray(prev) ? [...prev, response] : [response]));
    }
  }, []);

  const markAllNotiRead = () => {
    // Emit an event to the server to update notifications as read for the user
    if (socket && user?._id) {
      socket.emit("markAllNotificationsRead", user._id);  // Send user id to mark all notifications as read
    }
  
    // Update state to mark all notifications as read
    setNotification((prevNotifications) => {
      const updatedNotifications = prevNotifications.map((n) => ({
        ...n,
        isRead: true,
      }));
  
      // Optionally save it in localStorage or your database
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  
      return updatedNotifications;
    });
  };
  
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
        onlineUsers,
        notifications,
        allUsers,
        markAllNotiRead
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};