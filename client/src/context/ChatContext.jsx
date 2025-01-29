import { createContext, useEffect, useState } from "react";

import { baseUrl , getfetch } from "../utils/services";


export const chatcontext = createContext();
export const chatcontextProvider = ({childern , user})=>
{
    const [userChats , setUserChats] = useState(null);
    const [isUserChatLoding , setIsUserChatLoding] = useState(false);
    const [userChatsError , setuserChatsError] = useState(null);

    useEffect(()=>{
        const getUserChats = async()=>{
            if (user?._id)
            {
                setIsUserChatLoding(true);
                setuserChatsError(null);
                const response = await getfetch(`${baseUrl}/chats/${user._id}`);
                if (response.error)
                {
                    return setuserChatsError(response);
                }
                setUserChats(response);
            }
        }
    },[])
    return <chatcontextProvider value={{
        userChats,
        isUserChatLoding,
        userChatsError,
    }}>{childern}</chatcontextProvider>
}