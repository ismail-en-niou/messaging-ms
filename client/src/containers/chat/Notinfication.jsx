import React, { useContext, useEffect, useState } from "react";
import { unreadNotificationFunc } from "../../utils/unreadNotifications";
import { ChatContext } from "../../context/ChatContext";

const Notification = ({ isOpen, notifications, userChats = [], allUsers = [] }) => {
  const [storedNotifications, setStoredNotifications] = useState([]);
  const { markAllnotiRead } = useContext(ChatContext);

  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
    setStoredNotifications(savedNotifications);
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
        const unreadNotifications = notifications.filter(n => !n.isRead);
        localStorage.setItem("notifications", JSON.stringify(unreadNotifications));
        setStoredNotifications(unreadNotifications);
    }
}, [notifications]);

  if (!isOpen) return null;

  const unreadNotifications = unreadNotificationFunc(storedNotifications);
  const unreadCount = unreadNotifications.length;

  const handleMarkAllRead = () => {
    markAllnotiRead();
    setStoredNotifications([]); // Clear state notifications
    localStorage.removeItem("notifications"); // Clear localStorage
  };

  // Optimize by combining sender lookup and chat membership
  const modifiedNotifications = storedNotifications.map((notif) => {
    const sender = allUsers.find((u) => u._id === notif.senderId);
    const chat = userChats.find((chat) => chat.members?.includes(notif.senderId));

    // Get names of chat members excluding the sender
    const chatMemberNames = chat
      ? chat.members
          .filter((id) => id !== sender?._id)
          .map((id) => {
            const member = allUsers.find((u) => u._id === id);
            return member ? member.username : "Unknown Member";
          })
          .join(", ")
      : "No chat found";

    return {
      ...notif,
      senderName: sender ? sender.username : "Unknown Sender",
      chatMemberNames,
      chat,
    };
  });
  console.log(modifiedNotifications);
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown time";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Notifications ({unreadCount})</h2>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {storedNotifications.length > 0 ? (
        <ul className="space-y-2 max-h-80 overflow-y-auto">
          {modifiedNotifications.map((notif, index) => (
            <li
              key={index}
              className={`p-2 rounded-md ${notif.isRead ? "bg-gray-200" : "bg-blue-100"} hover:bg-blue-200 cursor-pointer transition-all`}
            >
              <p className="text-sm">
                📩 New message from <span className="font-bold">{notif.senderName}</span>
              </p>
              <p className="text-xs text-gray-500">
                Chat: {notif.chat ? `Chat with ${notif.chatMemberNames}` : "No chat found"}
              </p>
              <span className="text-xs text-gray-500">
                {formatTimestamp(notif.timestamp)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No new notifications</p>
      )}
    </div>
  );
};

export default Notification;
