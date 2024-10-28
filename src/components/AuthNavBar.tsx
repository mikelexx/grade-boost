import Link from "next/link";
import Image from "next/image";
import Search from "./Search";
export default function ResultsPageNavBar({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50  h-16 flex items-center justify-between px-4 bg-gray-100 text-black shadow-md">
      <div className="flex-row space-x-4">
        <Image src='/images/logo.png' width={60} height={60} alt='Logo' className="inline-block" />
        <Link className="text-lg font-bold" href="/">
          GradeBoost
        </Link>
      </div>
      <div className="flex-grow mx-4">
        <Search isRounded={false} onSearch={onSearch} />
      </div>
      <div className="flex space-x-4">
        <Link className="hover:underline" href="#signup">
        </Link>
        <div className="relative">
          <select className="mt-1 rounded-md border-gray-300 bg-white text-black">
            <option value="English" selected>English</option>
            <option value="Swahili">Swahili</option>
          </select>
        </div>
      </div>
    </nav>
  );
}
