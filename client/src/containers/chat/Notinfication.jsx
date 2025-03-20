import React, { useContext, useEffect, useState } from "react";
import { unreadNotificationFunc } from "../../utils/unreadNotifications";
import { ChatContext } from "../../context/ChatContext";

const Notification = ({ isOpen, notifications, userChats = [], allUsers = [] }) => {
  const [storedNotifications, setStoredNotifications] = useState([]);
  const { markAllnotiRead } = useContext(ChatContext);

  // Load notifications from localStorage on component mount
  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
    setStoredNotifications(savedNotifications);
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
      setStoredNotifications(notifications);
    }
  }, [notifications]);

  if (!isOpen) return null;

  const unreadNotifications = unreadNotificationFunc(storedNotifications);
  const unreadCount = unreadNotifications.length;

  const handleMarkAllRead = () => {
    markAllnotiRead(); // Mark all notifications as read in context
    setStoredNotifications([]); // Clear state
    localStorage.removeItem("notifications"); // Remove from localStorage
  };

  const modifiedNotifications = storedNotifications.map((n) => {
    const sender = allUsers.find((u) => u._id === n.senderId);
    return {
      ...n,
      senderName: sender ? sender.name : "Unknown Sender",
    };
  });

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
        <ul className="space-y-2">
          {modifiedNotifications?.map((notif, index) => {
            const sender = allUsers.find((u) => u._id === notif.senderId);
            const chat = userChats.find((chat) => chat.members?.includes(notif.senderId));

            const chatMemberNames = chat
              ? chat.members
                  .filter((id) => id !== sender?._id)
                  .map((id) => {
                    const member = allUsers.find((u) => u._id === id);
                    return member ? member.name : "Unknown Member";
                  })
                  .join(", ")
              : "No chat found";

            return (
              <li
                key={index}
                className={`p-2 rounded-md ${notif.isRead ? "bg-gray-200" : "bg-blue-100"}`}
              >
                <p className="text-sm">
                  📩 New message from <span className="font-bold">{sender ? sender.name : "Unknown Sender"}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Chat: {chat ? `Chat with ${chatMemberNames}` : "No chat found"}
                </p>
                <span className="text-xs text-gray-500">
                  {notif.timestamp ? new Date(notif.timestamp).toLocaleString() : "Unknown time"}
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
