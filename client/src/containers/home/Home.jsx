import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router for navigation
import Navbar from "../navBar/Navbar";
import Cookies from 'js-cookie';

export default function Home() {
  const navigate = useNavigate();
  const token = Cookies.get('token');
  const all = Cookies.get('all');
  if (!token && !all) {
    navigate('/');
  }

  // Retrieve user and token from cookies
  const username = all
    ? (() => {
        try {
          return JSON.parse(all).username;
        } catch {
          return null;
        }
      })()
    : null;


  // Redirect to login if not authenticated

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    setMessages([...messages, { user: username || 'Guest', text: newMessage }]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col bg-gray-100">
        <header className="bg-blue-600 text-white p-4 text-center">
          <h1 className="text-2xl font-bold">Welcome, {username || 'Guest'}!</h1>
        </header>

        <div className="flex-grow overflow-hidden flex flex-col justify-between">
          {/* Messages Display */}
          <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div key={index} className="mb-4">
                  <p className="font-semibold">{message.user}:</p>
                  <p>{message.text}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center mt-10">
                No messages yet. Start the conversation!
              </p>
            )}
          </div>

          {/* Message Input */}
          <div className="bg-white p-4 border-t">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition duration-300"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
