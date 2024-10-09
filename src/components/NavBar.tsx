import Link from "next/link";
import Image from "next/image";
import NavBarClient from "./NavBarClient";
export default function NavBar(){
  return (
    <nav className="flex items-center justify-between p-4 bg-white text-black ">
	    <div className="flex-row space-x-4">
	    <Image src='/images/logo.png' width={70} height={70} alt='Logo' className="inline-block"/>
	      <Link className="text-lg font-bold" href="/">
		GradeBoost
	      </Link>
	    </div>
      <div className="flex space-x-4">
      <NavBarClient/>
      <Link className="hover:underline" href="#signup">
   	</Link>
        <div className="relative">
          <select className="mt-1 rounded-md border-gray-300 bg-white text-black ">
            <option value="English" selected>
              English
            </option>
            <option value="Swahili">Swahili</option>
          </select>
        </div>
      </div>
    </nav>
  );
}

