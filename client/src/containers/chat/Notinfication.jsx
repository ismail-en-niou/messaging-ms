import React from "react";

const Notification = ({ isOpen, notifications, userChats, allUsers }) => {
  if (!isOpen) return null; // Hide if isOpen is false
  
  // Add safe checks for undefined `userChats` and `allUsers`
  const safeUserChats = userChats || [];
  const safeAllUsers = allUsers || [];

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">Notifications</h2>
      {notifications.length > 0 ? (
        <ul className="space-y-2">
          {notifications?.map((notif, index) => {
            const sender = safeAllUsers.find((user) => user.id === notif.senderId);
            const chat = safeUserChats.find((chat) =>
              chat.members?.some((id) => id === notif.senderId)
            );

            return (
              <li
                key={index}
                className={`p-2 rounded-md ${notif.isRead ? "bg-gray-200" : "bg-blue-100"}`}
              >
                <p className="text-sm">
                  📩 New message from{" "}
                  <span className="font-bold">{sender ? sender.name : "Unknown"}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Chat: {chat ? `Chat with ${chat.members.filter(id => id !== sender?.id).join(', ')}` : "Unknown"}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(notif.timestamp).toLocaleString()}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No new notifications</p>
      )}
    </div>
  );
};

export default Notification;
