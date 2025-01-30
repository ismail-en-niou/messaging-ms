import { createContext, useEffect, useState } from "react";
import { baseUrl, getfetch } from "../utils/services";

export const ChatContext = createContext(); // ✅ Ensure first letter is uppercase

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatLoding, setIsUserChatLoding] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatLoding(true);
        setUserChatsError(null);
        const response = await getfetch(`${baseUrl}/chat/user/${user._id}`);
        if (response.error)
          return setUserChatsError(response);
        setUserChats(response);
      }
    };

    getUserChats(); // ✅ Ensure function is called inside useEffect
  }, [user?._id]); // ✅ Dependency array ensures it re-runs when `user` changes

  return (
    <ChatContext.Provider value={{ userChats, isUserChatLoding, userChatsError }}>
      {children}
    </ChatContext.Provider>
  );
};
