"use client";
import { usePathname } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import app from "../../firebaseConfig";

export default function SignUpButtonClient() {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // state to toggle dropdown
  const pathname = usePathname();
  const isAuthPage = pathname === '/auth';

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const auth = getAuth(app);
    await signOut(auth);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (e) => {
    if (e.target.closest('.profile-dropdown') === null) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  return !isAuthPage && (
    !user ? (
      <button className="bg-black text-white">
        <Link className="hover:underline" href="/auth">SignUp</Link>
      </button>
    ) : (
      <div className="relative profile-dropdown inline-block">
        {/* Profile and caret */}
        <div
          className="flex items-center cursor-pointer"
          onClick={toggleDropdown}  // Toggle dropdown on click
        >
          <img
            src={user.photoURL || '/images/default-avatar.png'}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          {/* Caret */}
          <span className={`ml-2 transition-transform duration-300 ${isDropdownOpen ? "rotate-90" : ""}`}>
            &gt;
          </span>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
            <ul className="py-1">
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="/saved-materials">Saved Materials</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <button onClick={handleSignOut}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    )
  );
}

