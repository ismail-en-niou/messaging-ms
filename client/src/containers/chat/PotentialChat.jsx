import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { UserContext } from "../../context/UserContext";

const PotentialChats = ({ searchQuery }) => {
  const { user } = useContext(UserContext);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

  const filteredUsers = potentialChats.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get user avatar initials with better formatting
  const getAvatarInitials = (username) => {
    if (!username) return "?";
    const names = username.split(" ");
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return username.charAt(0).toUpperCase();
  };

  // Generate consistent avatar colors based on username
  const getAvatarColor = (username) => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", 
      "bg-indigo-500", "bg-yellow-500", "bg-red-500", "bg-teal-500",
      "bg-orange-500", "bg-cyan-500"
    ];
    
    if (!username) return "bg-gray-500";
    
    const hash = username.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Check if user is online
  const isUserOnline = (userId) => {
    return onlineUsers?.some((onlineUser) => onlineUser?.userId === userId);
  };

  // Handle creating chat with loading state
  const handleCreateChat = async (userId) => {
    try {
      await createChat(user._id, userId);
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-[#111b21]">
      {/* Header */}
      {searchQuery && (
        <div className="px-4 py-3 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-gray-200 dark:border-[#313d44]">
          <p className="text-sm text-[#667781] dark:text-[#8696a0]">
            {filteredUsers.length > 0 
              ? `${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''} found`
              : 'No users found'
            }
            {searchQuery && (
              <span className="ml-1">
                for "<span className="font-medium text-[#111b21] dark:text-[#e9edef]">{searchQuery}</span>"
              </span>
            )}
          </p>
        </div>
      )}

      {/* Users List */}
      <div className="divide-y divide-gray-200 dark:divide-[#313d44]">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            {searchQuery ? (
              <>
                {/* No search results */}
                <div className="w-24 h-24 mb-6 opacity-20">
                  <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#667781] dark:text-[#8696a0]">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    <path d="M12 12h-2v-2h2v2zm0-4h-2V6h2v2z"/>
                  </svg>
                </div>
                <h3 className="text-[#41525d] dark:text-[#8696a0] text-lg font-medium mb-2">
                  No users found
                </h3>
                <p className="text-[#667781] dark:text-[#8696a0] text-sm text-center max-w-xs">
                  Try searching with a different name or check the spelling.
                </p>
              </>
            ) : (
              <>
                {/* No potential chats */}
                <div className="w-24 h-24 mb-6 opacity-20">
                  <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#667781] dark:text-[#8696a0]">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.986 2.986 0 0 0 17.09 7c-.8 0-1.54.37-2.01.97l-2.66 3.36c-.75.94-.75 2.25 0 3.19l1.16 1.46c.25.31.25.76 0 1.07l-2.24 2.8A.997.997 0 0 0 12 22h2.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5H13l1.5-1.87L16 22h4z"/>
                    <path d="M12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5z"/>
                  </svg>
                </div>
                <h3 className="text-[#41525d] dark:text-[#8696a0] text-lg font-medium mb-2">
                  No new contacts
                </h3>
                <p className="text-[#667781] dark:text-[#8696a0] text-sm text-center max-w-xs">
                  You have started conversations with all available users.
                </p>
              </>
            )}
          </div>
        ) : (
          filteredUsers.map((u, index) => {
            const isOnline = isUserOnline(u._id);
            const avatarColor = getAvatarColor(u.username);
            
            return (
              <div
                key={u._id || index}
                className="flex items-center p-4 hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] cursor-pointer transition-all duration-200 group"
                onClick={() => handleCreateChat(u._id)}
              >
                <div className="flex items-center flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0 mr-3">
                    <div className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center text-white shadow-sm`}>
                      <span className="text-lg font-medium">
                        {getAvatarInitials(u.username)}
                      </span>
                    </div>
                    
                    {/* Online status indicator */}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-[#111b21] ${
                      isOnline ? "bg-[#00a884]" : "bg-[#667781]"
                    }`}></div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-[#111b21] dark:text-[#e9edef] truncate text-base">
                        {u.username}
                      </h3>
                      
                      {/* Add to chat icon */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
                        <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" className="fill-white">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-[#667781] dark:text-[#8696a0] mt-0.5">
                      {isOnline ? (
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-[#00a884] rounded-full mr-2"></span>
                          Online
                        </span>
                      ) : (
                        "Tap to start chatting"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer info */}
      {filteredUsers.length > 0 && (
        <div className="px-4 py-3 bg-[#f0f2f5] dark:bg-[#202c33] border-t border-gray-200 dark:border-[#313d44]">
          <p className="text-xs text-[#667781] dark:text-[#8696a0] text-center">
            Tap on a contact to start a new conversation
          </p>
        </div>
      )}
    </div>
  );
};

export default PotentialChats;