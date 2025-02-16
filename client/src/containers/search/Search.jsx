import React, { useState } from 'react';
import PotentialChats from '../chat/PotentialChat';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-3 pl-10 pr-4 text-lg bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="absolute left-3 top-3 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 18l6-6m0 0a8 8 0 10-8 8 8 8 0 008-8z"
          />
        </svg>
      </div>
      <PotentialChats searchQuery={searchQuery} />
    </div>
  );
}

export default Search;
