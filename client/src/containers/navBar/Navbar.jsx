import React, { useState } from "react";

const ChatNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="text-white text-xl font-bold">
                ChatApp
              </a>
            </div>

            {/* Right side (Profile, Notifications, Chat Toggle) */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleChat}
                className="text-white bg-blue-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
              >
                {isChatOpen ? "Close Chat" : "Open Chat"}
              </button>
              <button className="text-white hover:bg-blue-700 p-2 rounded-full focus:outline-none">
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
              </button>
              <img
                src="https://via.placeholder.com/40"
                alt="User"
                className="h-10 w-10 rounded-full border-2 border-white"
              />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white hover:bg-blue-700 p-2 rounded-md focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
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
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={toggleChat}
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              >
                {isChatOpen ? "Close Chat" : "Open Chat"}
              </button>
              <a
                href="#"
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              >
                Notifications
              </a>
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

      {/* Chat Window (Toggleable) */}
      {isChatOpen && (
        <div className="bg-gray-100 border-t border-gray-300 fixed bottom-0 left-0 right-0 h-64">
          <div className="p-4">
            <h2 className="text-lg font-bold">Chat Window</h2>
            <div className="h-40 bg-white rounded-md shadow-inner p-2 overflow-y-auto">
              <p className="text-sm text-gray-600">Welcome to the chat!</p>
            </div>
            <input
              type="text"
              className="mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Type a message..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatNavbar;
