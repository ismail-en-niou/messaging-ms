import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { ChatContext } from "../../context/ChatContext";
import Notification from "../chat/Notinfication";

const ChatNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, userChats, allUsers } = useContext(ChatContext);
  const { user, logout } = useContext(UserContext);
  const [notti, setNotti] = useState([]);

  // Refs for click outside detection
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const menuRef = useRef(null);

  // Load notifications from localStorage on component mount
  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotti(savedNotifications);
  }, []);

  // Update localStorage and state when notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
      setNotti(notifications);
    }
  }, [notifications]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logouthandel = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsNotificationOpen(false);
    setIsProfileOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsMenuOpen(false);
    setIsNotificationOpen(false);
  };

  const goToSearch = () => {
    navigate("/search");
    setIsMenuOpen(false);
  };

  const goToChat = () => {
    navigate("/home");
    setIsMenuOpen(false);
  };

  // Generate user avatar color
  const getUserAvatarColor = (username) => {
    const colors = [
      "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3",
      "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a"
    ];
    
    if (!username) return "#6b7c85";
    
    const hash = username.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Get unread notification count
  const unreadCount = notti.filter(n => !n.isRead).length;

  if (location.pathname === "/") return null;

  return (
    <nav className="bg-[#f0f2f5] dark:bg-[#202c33] border-b border-gray-200 dark:border-[#313d44] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* WhatsApp Logo */}
              <h1 className="text-xl font-medium text-[#111b21] dark:text-[#e9edef]">
                Messaging App
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Buttons */}
            <div className="flex items-center space-x-2">
              {location.pathname === "/search" && (
                <button
                  onClick={goToChat}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#00a884] hover:bg-[#008f72] text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" className="fill-white">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                  </svg>
                  <span>Chats</span>
                </button>
              )}
              {location.pathname === "/home" && (
                <button
                  onClick={goToSearch}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#54656f] hover:bg-[#3b4a54] text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" className="fill-white">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                  <span>Search</span>
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={toggleNotifications}
                  className={`p-2 rounded-full hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] transition-colors relative ${
                    isNotificationOpen ? 'bg-[#f5f6f6] dark:bg-[#2a3942]' : ''
                  }`}
                  title="Notifications"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" className="fill-[#54656f] dark:fill-[#8696a0]">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#00a884] text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 top-12 w-80 bg-white dark:bg-[#202c33] shadow-xl rounded-lg border border-gray-200 dark:border-[#313d44] z-50 max-h-96 overflow-hidden">
                    <Notification
                      user={user}
                      isOpen={isNotificationOpen}
                      notifications={notti}
                      userChats={userChats}
                      allUsers={allUsers}
                    />
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className={`p-1 rounded-full hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] transition-colors ${
                    isProfileOpen ? 'bg-[#f5f6f6] dark:bg-[#2a3942]' : ''
                  }`}
                  title="Profile & Settings"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: getUserAvatarColor(user?.username) }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-12 w-64 bg-white dark:bg-[#202c33] shadow-xl rounded-lg border border-gray-200 dark:border-[#313d44] z-50 overflow-hidden">
                    {/* Profile Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-[#313d44]">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-medium"
                          style={{ backgroundColor: getUserAvatarColor(user?.username) }}
                        >
                          {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#111b21] dark:text-[#e9edef] truncate">
                            {user?.username || 'User'}
                          </p>
                          <p className="text-sm text-[#667781] dark:text-[#8696a0] truncate">
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Profile Menu Items */}
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          // Add profile logic here
                        }}
                        className="w-full text-left p-3 rounded-lg hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] text-[#111b21] dark:text-[#e9edef] transition-colors flex items-center space-x-3"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" className="fill-[#54656f] dark:fill-[#8696a0]">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <span>Profile</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          // Add settings logic here
                        }}
                        className="w-full text-left p-3 rounded-lg hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] text-[#111b21] dark:text-[#e9edef] transition-colors flex items-center space-x-3"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" className="fill-[#54656f] dark:fill-[#8696a0]">
                          <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                        </svg>
                        <span>Settings</span>
                      </button>

                      <hr className="my-2 border-gray-200 dark:border-[#313d44]" />
                      
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logouthandel();
                        }}
                        className="w-full text-left p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors flex items-center space-x-3"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
                          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                        </svg>
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" className="fill-[#54656f] dark:fill-[#8696a0]">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-[#313d44]" ref={menuRef}>
          <div className="bg-white dark:bg-[#202c33] px-4 py-4 space-y-3">
            {/* Mobile Profile Section */}
            <div className="flex items-center space-x-3 p-3 bg-[#f5f6f6] dark:bg-[#2a3942] rounded-lg">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: getUserAvatarColor(user?.username) }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#111b21] dark:text-[#e9edef] truncate">
                  {user?.username || 'User'}
                </p>
                <p className="text-sm text-[#667781] dark:text-[#8696a0] truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>

            {/* Mobile Navigation Buttons */}
            <div className="space-y-2">
              {location.pathname === "/search" && (
                <button
                  onClick={goToChat}
                  className="w-full flex items-center space-x-3 p-3 bg-[#00a884] hover:bg-[#008f72] text-white rounded-lg font-medium transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" className="fill-white">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                  </svg>
                  <span>Go to Chats</span>
                </button>
              )}
              {location.pathname === "/home" && (
                <button
                  onClick={goToSearch}
                  className="w-full flex items-center space-x-3 p-3 bg-[#54656f] hover:bg-[#3b4a54] text-white rounded-lg font-medium transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" className="fill-white">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                  <span>Go to Search</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  // Add profile logic
                }}
                className="w-full flex items-center space-x-3 p-3 hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] text-[#111b21] dark:text-[#e9edef] rounded-lg transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-[#54656f] dark:fill-[#8696a0]">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span>Profile</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  toggleNotifications();
                }}
                className="w-full flex items-center justify-between p-3 hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] text-[#111b21] dark:text-[#e9edef] rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" className="fill-[#54656f] dark:fill-[#8696a0]">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                  </svg>
                  <span>Notifications</span>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-[#00a884] text-white text-xs font-bold px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logouthandel();
                }}
                className="w-full flex items-center space-x-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                <span>Log out</span>
              </button>
            </div>

            {/* Mobile Notifications */}
            {isNotificationOpen && (
              <div className="mt-4 border-t border-gray-200 dark:border-[#313d44] pt-4">
                <Notification
                  user={user}
                  isOpen={isNotificationOpen}
                  notifications={notti}
                  userChats={userChats}
                  allUsers={allUsers}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default ChatNavbar;