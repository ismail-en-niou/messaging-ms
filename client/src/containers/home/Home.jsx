import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router for navigation
import Navbar from "../navBar/Navbar";
import Cookies from 'js-cookie';

export default function Home() {
  const navigate = useNavigate();

  // Retrieve user and token from cookies
  const all = Cookies.get('all');
  const username = all
    ? (() => {
        try {
          return JSON.parse(all).username;
        } catch {
          return null;
        }
      })()
    : null;

  const token = Cookies.get('token');

  // Redirect to login if not authenticated
  if (!token || !all) {
    navigate('/');
  }

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  // List of contacts (example)
  const contacts = [
    { username: 'Alice', id: 1 },
    { username: 'Bob', id: 2 },
    { username: 'Charlie', id: 3 },
    { username: 'David', id: 4 },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedContact) return;
    setMessages([...messages, { user: username || 'Guest', text: newMessage }]);
    setNewMessage('');
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setMessages([]); // Clear the message history when selecting a new contact
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar - Contacts */}
      <div className="w-1/4 bg-gray-800 text-white p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Contacts</h2>
        <ul>
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className={`py-2 px-4 cursor-pointer hover:bg-gray-700 rounded ${
                selectedContact?.id === contact.id ? 'bg-blue-600' : ''
              }`}
              onClick={() => handleSelectContact(contact)}
            >
              {contact.username}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Panel - Chat Area */}
      <div className="flex-grow bg-gray-100 flex flex-col">
        <Navbar />

        {/* Chat Header */}
        <header className="bg-blue-600 text-white p-4 text-center">
          <h1 className="text-2xl font-bold">
            {selectedContact ? `Chat with ${selectedContact.username}` : 'Select a contact'}
          </h1>
        </header>

        {/* Messages Display */}
        <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
          {selectedContact ? (
            messages.length > 0 ? (
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
            )
          ) : (
            <p className="text-gray-500 text-center mt-10">
              Please select a contact to start chatting.
            </p>
          )}
        </div>

        {/* Message Input */}
        {selectedContact && (
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
        )}
      </div>
    </div>
  );
}
