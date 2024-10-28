"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Popup from 'reactjs-popup';
import { FaUpload } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { CurrentUser } from '@/types/CurrentUser';
import { useRouter } from 'next/navigation';

import { getAuth, onAuthStateChanged, User} from "firebase/auth";
import app from '../../firebaseConfig';

interface UploadButtonProps {
  currUser?: CurrentUser | null | User;
}

export default function UploadButton({ currUser }: UploadButtonProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [user, setUser] = useState(currUser);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (userFromAuth) => {
      setUser(userFromAuth);
    });
    return () => unsubscribe();
  }, []);

  const handleUploadClick = () => {
    if (!user) {
      // Show a popup asking the user to log in or sign up
      setIsPopupOpen(true);
    } else {
      // Redirect to the upload page
      router.push('/upload');
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <button
        onClick={handleUploadClick}
        className="flex items-center space-x-1 text-black-500 hover:text-black-700 px-4 py-2 bg-transparent border rounded-md shadow-sm hover:bg-gray-100"
      >
        <FaUpload />
        <span>Upload</span>
      </button>

      <Popup open={isPopupOpen} onClose={closePopup} position="top center">
        <div className="p-4 bg-white shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Please Sign In</h2>
            <button onClick={closePopup}>
              <IoClose size={24} className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          <p className="mb-4">You need to log in or sign up to upload files.</p>
            <Link href={'/auth'} className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Log In / Sign Up
            </Link>
        </div>
      </Popup>
    </>
  );
}

