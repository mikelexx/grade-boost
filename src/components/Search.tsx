"use client"
import { useState } from 'react';
interface SearchProps {
  isRounded?: boolean;
  onSearch: (query: string) => void; // New prop
}
/*this components takes user query string then calles the function its prodived
* with with this query as argument*/
export default function Search({ isRounded = true, onSearch }: SearchProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim()); // Trigger search
    }
  };

  return (
    <>
      <div className={`flex items-center justify-center py-8 z-50`}>
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search for notes, past papers, assignments..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className={`w-full p-4 pl-12 text-black shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isRounded ? 'rounded-full' : 'rounded-none'
            } whitespace-nowrap overflow-hidden text-ellipsis`}
          />
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onClick={handleSearch}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m1.45-5.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

