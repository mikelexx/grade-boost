import Link from "next/link";
import Image from "next/image";
import SignUpButtonClient from "./SignupButtonClient";
import UploadButton from "./UploadButton";

export default function NavBar() {
  return (
     <nav className="shadow-lg flex items-center justify-between p-4 bg-gray-100 text-black fixed top-0 left-0 z-20 w-full">
      <div className="flex-row space-x-4">
        <Image src='/images/logo.png' width={70} height={70} alt='Logo' className="inline-block" />
        <Link className="text-lg font-bold" href="/">
          GradeBoost
        </Link>
      </div>
      <div className="flex space-x-4 items-center">
	<Link className="hover:underline" href="/about">About</Link>
	<Link className="hover:underline" href="#features">Features</Link>
	<Link className="hover:underline" href="#demo">Demo</Link>
	<SignUpButtonClient/>
	<UploadButton />
	{/*
	<div className="relative">
          <select defaultValue='English' className="mt-1 rounded-md border-gray-300 bg-white text-black ">
            <option value="English">English</option>
            <option value="Swahili">Swahili</option>
          </select>
        </div>
	*/}
      </div>
    </nav>
  );
}
