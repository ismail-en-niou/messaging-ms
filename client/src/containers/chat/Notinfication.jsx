import React, { useContext, useEffect, useState } from "react";
import { unreadNotificationFunc } from "../../utils/unreadNotifications";
import { ChatContext } from "../../context/ChatContext";
import moment from "moment";

const Notification = ({ isOpen, notifications, userChats = [], allUsers = [] }) => {
  const [storedNotifications, setStoredNotifications] = useState([]);
  const { markAllnotiRead, updateCurentChat } = useContext(ChatContext);

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
    setStoredNotifications([]);
    localStorage.removeItem("notifications");
  };

  // Handle notification click to open chat
  const handleNotificationClick = (notif) => {
    if (notif.chat) {
      updateCurentChat(notif.chat);
      // Mark this notification as read
      const updatedNotifications = storedNotifications.filter(n => n !== notif);
      setStoredNotifications(updatedNotifications);
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    }
  };

  // Get user avatar initials
  const getAvatarInitials = (username) => {
    if (!username) return "?";
    return username.charAt(0).toUpperCase();
  };

  // Format time like WhatsApp
  const formatWhatsAppTime = (timestamp) => {
    if (!timestamp) return "";
    const now = moment();
    const messageTime = moment(timestamp);
    
    if (now.diff(messageTime, 'minutes') < 1) {
      return 'now';
    } else if (now.diff(messageTime, 'hours') < 1) {
      return `${now.diff(messageTime, 'minutes')}m`;
    } else if (now.diff(messageTime, 'days') === 0) {
      return messageTime.format('HH:mm');
    } else if (now.diff(messageTime, 'days') === 1) {
      return 'yesterday';
    } else if (now.diff(messageTime, 'days') < 7) {
      return messageTime.format('ddd');
    } else {
      return messageTime.format('DD/MM/YY');
    }
  };

  // Optimize by combining sender lookup and chat membership
  const modifiedNotifications = storedNotifications.map((notif) => {
    const sender = allUsers.find((u) => u._id === notif.senderId);
    const chat = userChats.find((chat) => chat.members?.includes(notif.senderId));

    return {
      ...notif,
      senderName: sender ? sender.username : "Unknown Sender",
      sender,
      chat,
    };
  });

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed"
        onClick={() => {/* Close notification */}}
      />
      
      {/* Notification Panel */}
      <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-[#202c33] shadow-2xl rounded-lg border border-gray-200 dark:border-[#313d44] z-50 overflow-hidden">
        {/* Header */}
        <div className="bg-[#f0f2f5] dark:bg-[#202c33] px-6 py-4 border-b border-gray-200 dark:border-[#313d44]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-[#111b21] dark:text-[#e9edef]">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="bg-[#00a884] text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-[#00a884] hover:text-[#008f72] font-medium transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {modifiedNotifications.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-[#313d44]">
              {modifiedNotifications.map((notif, index) => (
                <div
                  key={index}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] cursor-pointer transition-all duration-200 ${
                    !notif.isRead ? 'bg-[#f0f8ff] dark:bg-[#0f2a1c]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-[#6b7c85] flex items-center justify-center text-white">
                        <span className="text-lg font-medium">
                          {getAvatarInitials(notif.senderName)}
                        </span>
                      </div>
                      {/* Unread indicator */}
                      {!notif.isRead && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00a884] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">!</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-[#111b21] dark:text-[#e9edef] truncate">
                          {notif.senderName}
                        </p>
                        <span className="text-xs text-[#667781] dark:text-[#8696a0] flex-shrink-0 ml-2">
                          {formatWhatsAppTime(notif.timestamp)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" className="fill-[#00a884] flex-shrink-0">
                          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                        </svg>
                        <p className="text-sm text-[#667781] dark:text-[#8696a0] truncate">
                          {notif.messagePreview || "New message"}
                        </p>
                      </div>

                      {notif.chat && (
                        <p className="text-xs text-[#667781] dark:text-[#8696a0] truncate">
                          Click to open chat
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 opacity-30">
                <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#667781] dark:text-[#8696a0]">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <p className="text-[#667781] dark:text-[#8696a0] text-sm">
                No new notifications
              </p>
              <p className="text-[#667781] dark:text-[#8696a0] text-xs mt-1">
                You're all caught up!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {modifiedNotifications.length > 0 && (
          <div className="bg-[#f0f2f5] dark:bg-[#202c33] px-6 py-3 border-t border-gray-200 dark:border-[#313d44]">
            <p className="text-xs text-[#667781] dark:text-[#8696a0] text-center">
              {modifiedNotifications.length} notification{modifiedNotifications.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Notification;