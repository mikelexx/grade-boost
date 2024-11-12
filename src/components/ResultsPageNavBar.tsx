import Link from "next/link";
import Search from "./Search";
import { useState } from "react";
import UploadButton from "./UploadButton";

interface ResultsPageNavBarProps {
  onSearch: (query: string) => void;
}

export default function ResultsPageNavBar({ onSearch }: ResultsPageNavBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 bg-gray-100 text-black shadow-md">
      <div className="flex-row space-x-4">
      <Link href="/" className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-pulse tracking-wide drop-shadow-lg">
      Grade<span className="text-4xl italic text-yellow-300">Boost</span>
      </Link>
      </div>
      <div className="flex-grow mx-4">
        <form onSubmit={handleSearchSubmit}>
          <Search
	  isRounded={false}
	  onSearch={(query) => {
		  setSearchQuery(query);
		  onSearch(query);
	  }}
          />
        </form>
      </div>
      <div className="flex space-x-4">
        <Link className="hover:underline" href="#signup"></Link>
        <div className="relative">
	{/*
          <select className="mt-1 rounded-md border-gray-300 bg-white text-black">
            <option value="English" selected>English</option>
            <option value="Swahili">Swahili</option>
          </select>

		*/}
	       <UploadButton/>
        </div>
      </div>
    </nav>
  );
}

