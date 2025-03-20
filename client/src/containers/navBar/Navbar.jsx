import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { ChatContext } from "../../context/ChatContext";
import Notification from "../chat/Notinfication";

const ChatNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(UserContext);
  const { notifications, userChats, allUsers } = useContext(ChatContext);
  const [notti, setNotti] = useState([]);

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

  const { user } = useContext(UserContext);
  if (!context) {
    console.error("UserContext is undefined! Make sure UserContextProvider is wrapping your app.");
    return <div>Error: Context not available</div>;
  }

  const { logout } = context;

  const logouthandel = () => {
    logout();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const goToSearch = () => {
    navigate("/search");
  };

  const goToChat = () => {
    navigate("/home");
  };

  if (location.pathname === "/") {
    return null;
  }

  return (
    <div>
      <nav className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-12">
              <a href="/" className="text-white text-xl font-bold">
                ChatApp
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {location.pathname === "/search" && (
                <button
                  onClick={goToChat}
                  className="text-white bg-green-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Go to Chat
                </button>
              )}
              {location.pathname === "/home" && (
                <button
                  onClick={goToSearch}
                  className="text-white bg-blue-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-900"
                >
                  Go to Search
                </button>
              )}

              <button
                onClick={logouthandel}
                className="text-white bg-blue-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
              >
                Logout
              </button>

              <div className="relative">
                <button 
                  onClick={toggleNotifications}
                  className="text-white hover:bg-blue-700 p-2 rounded-full focus:outline-none">
                  <span className="sr-only">Notifications</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 7 8.388 7 10v4.158c0 .538-.214 1.055-.595 1.437L5 17h5m5 0a3.5 3.5 0 01-7 0"
                    />
                  </svg>
                  {notti.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {notti.length}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-10">
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
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-blue-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={logouthandel}
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              >
                Logout
              </button>
              <Notification notifications={notti} userChats={userChats} allUsers={allUsers} />
              <a
                href="#"
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              >
                Profile
              </a>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default ChatNavbar;
