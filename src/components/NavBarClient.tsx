
"use client";
import { usePathname } from "next/navigation";
import Search from "./Search";
import Link from "next/link";

export default function NavBarClient(){
	const pathname = usePathname();
	const isResultsPage = pathname === '/results';

       return !isResultsPage  &&
          <>
	      <Link className="hover:underline" href="#about">
	      About
	      </Link>
	      <Link className="hover:underline" href="#features">
	      Features
	      </Link>
	      <Link className="hover:underline" href="#demo">
	      Demo
	      </Link>
	   </>
}
