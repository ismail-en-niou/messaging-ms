import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { UserContext } from "../../context/UserContext";

const PotentialChats = ({ searchQuery }) => {
  const { user } = useContext(UserContext);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

  const filteredUsers = potentialChats.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-4 space-y-3">
      {filteredUsers.length === 0 ? (
        <div className="text-gray-500 text-center py-4">No users found</div>
      ) : (
        filteredUsers.map((u, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
            onClick={() => createChat(user._id, u._id)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white">
                {u.username[0].toUpperCase()}
              </div>
              <div className="font-semibold text-lg">{u.username}</div>
            </div>
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                onlineUsers?.some((onlineUser) => onlineUser?.userId === u?._id)
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
            ></span>
          </div>
        ))
      )}
    </div>
  );
};

export default PotentialChats;
