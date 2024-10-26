import Link from "next/link";
import Image from "next/image";
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
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 bg-white text-black shadow-md">
      <div className="flex-row space-x-4">
        <Image src='/images/logo.png' width={60} height={60} alt='Logo' className="inline-block" />
        <Link className="text-lg font-bold" href="/">
          GradeBoost
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

