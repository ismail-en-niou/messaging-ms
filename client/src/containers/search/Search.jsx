import React, { useState } from 'react';
import PotentialChats from '../chat/PotentialChat'; // Ensure that this component displays users or chats based on the search query.

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Start loading while searching (simulate fetching)
    setIsLoading(true);

    // Simulate network delay to fetch potential chat results
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust the timeout as necessary for realistic loading
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-3 pl-10 pr-4 text-lg bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Display loading state or search results */}
      {isLoading ? (
        <div className="text-center text-gray-500">Searching...</div>
      ) : (
        <PotentialChats searchQuery={searchQuery} />
      )}
    </div>
  );
}

export default Search;
