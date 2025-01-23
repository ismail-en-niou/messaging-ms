import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Home() {
  const all = Cookies.get('all');
  const username = all ? JSON.parse(all).username : null;
  const token = Cookies.get('token');
  
  if (!token) {
    window.location.href = '/';
  }

  const [messages, setMessages] = useState([]); // State to store chat messages
  const [newMessage, setNewMessage] = useState(''); // State to handle new messages

  // Simulating fetching previous messages (in a real app, you would fetch from the server)
  useEffect(() => {
    // Example of previously stored messages (replace with actual API call)
    setMessages([
      { user: 'Admin', text: 'Hello, how can I help you today?' },
      { user: 'John', text: 'Hi, I have a question about my account.' },
    ]);
  }, []);

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return; // Don't send empty messages

    // Add the new message to the state
    setMessages([...messages, { user: username, text: newMessage }]);
    setNewMessage(''); // Clear the input field
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-96 max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome, {username ? username : 'Guest'}!</h1>

        {/* Chat Messages */}
        <div className="h-64 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg shadow-inner">
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              <p className="font-semibold">{message.user}: </p>
              <p>{message.text}</p>
            </div>
          ))}
        </div>

        {/* New Message Input and Send Button */}
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            required
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition duration-300"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

