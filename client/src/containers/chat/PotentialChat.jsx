import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { UserContext } from "../../context/UserContext"; // Import UserContext to access the current user

const PotentialChats = () => {
  const { user } = useContext(UserContext); // Get the current user from UserContext
  const { potentialChats, createChat , onlineUsers } = useContext(ChatContext);

  // console.log("Potential Chats:", potentialChats);

  return (
    <div className="all-user">
      {potentialChats &&
        potentialChats.map((u, index) => {
          return (
            <div
              className="single-user"
              key={index}
              onClick={() => createChat(user._id, u._id)}
            >
              {u.username}
              <span className={
                onlineUsers?.some((user) => user?.userId === u?._id) ?
                "user-online" : ""
                }></span>
            </div>
          );
        })}
    </div>
  );
};

export default PotentialChats;