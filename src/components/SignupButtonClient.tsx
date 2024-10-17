"use client";
import { usePathname } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import app from "../../firebaseConfig";
import UserService from "../../services/firebaseUser";

export default function SignUpButtonClient() {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [password, setPassword] = useState(''); // State for password input
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

  const handleDeleteAccount = async () => {
    const currentUser = UserService.getCurrentUser();
    if (currentUser) {
      try {
        // Re-authenticate the user
        await UserService.reauthenticateUser(currentUser, password);

        // Now delete the user document and the user account
        await UserService.deleteUser(currentUser);
        alert('Your account has been deleted successfully.');
        setIsModalOpen(false); // Close modal
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('There was an error deleting your account. Please ensure your password is correct and try again.');
      }
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (e) => {
    if (e.target.closest('.profile-dropdown') === null) {
      setIsDropdownOpen(false);
      setIsModalOpen(false); // Close modal if clicked outside
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
        <div
          className="flex items-center cursor-pointer"
          onClick={toggleDropdown}
        >
          <img
            src={user.photoURL || '/images/defaultUser.jpeg'}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className={`ml-2 transition-transform duration-300 ${isDropdownOpen ? "rotate-90" : ""}`}>
            &gt;
          </span>
        </div>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
            <ul className="py-1">
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link href="/saved-materials">Saved Materials</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <button onClick={handleSignOut}>Logout</button>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <button onClick={() => setIsModalOpen(true)} className="text-red-500">Delete Account</button>
              </li>
            </ul>
          </div>
        )}

        {/* Modal for Password Confirmation */}
        {isModalOpen && (
          <div className="fixed left-0 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-lg font-semibold">Confirm Deletion</h2>
              <p>Please enter your password to confirm account deletion.</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border border-gray-300 p-2 w-full rounded mt-2"
                required
              />
              <div className="flex justify-end mt-4">
                <button onClick={() => setIsModalOpen(false)} className="mr-2 text-gray-500">Cancel</button>
                <button onClick={handleDeleteAccount} className="bg-red-500 text-white px-4 py-2 rounded">Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
}

