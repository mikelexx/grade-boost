import 'reactjs-popup/dist/index.css';
import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import { FaSave, FaSpinner } from "react-icons/fa";
import { IoClose } from 'react-icons/io5';
import Link from 'next/link';
import FileService from '../../services/firebaseFile';
import { User } from 'firebase/auth';


interface SaveProps {
  currUser?: User | null;
  fileId: string;
}

export default function Save({ currUser, fileId }: SaveProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedStatus = localStorage.getItem(`saved_${fileId}`);
    if (savedStatus === 'true') {
      setIsSaved(true);
    }
  }, [fileId]);

   const handleSaveClick = async () => {
    if (!currUser) {
      setIsPopupOpen(true);
      return;
    }

    try {
      setIsSaving(true);
      await FileService.saveMaterial(fileId, currUser.uid);
      setIsSaved(true);
      localStorage.setItem(`saved_${fileId}`, 'true'); // Save status to local storage
      console.log('File has been saved successfully!');
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Error saving file:', error);
      alert('There was an issue saving the file.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoginClick = () => {
    console.log('Redirecting to login/signup...');
    setIsPopupOpen(false);
  };

  const SaveButton = (
  <button
    onClick={handleSaveClick}
    disabled={isSaving || isSaved}
    className={`flex items-center space-x-1 text-blue-500 hover:text-blue-700 ${isSaving && 'opacity-50 cursor-not-allowed'}`}
  >
    {isSaving ? (
      <FaSpinner className="animate-spin" /> // Show spinning icon
    ) : (
      <FaSave />
    )}
    <span className='hidden sm:inline'>
      {isSaving ? 'Saving...' : isSaved ? 'Saved' :'Save'}  {/* Change text based on loading state */}
    </span>
  </button>
);
  return (
    <>
      <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} position="top center">
        <div className="p-4 bg-white shadow-lg rounded-lg">
          {currUser ? (
            <div>
              {/* If user is logged in but no additional actions needed */}
              <p>Saving the file...</p>
              {/* You can add a progress bar or loading indicator here */}
            </div>
          ) : (
            <div>
              <p>Please log in or sign up to save files.</p>
              <button className="mt-2 bg-green-500 text-white py-2 px-4 rounded">
                <Link href={'/auth'}>Log In / Sign Up</Link>
              </button>
              <button onClick={() => setIsPopupOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                <IoClose size={24} />
              </button>
            </div>
          )}
        </div>
      </Popup>
      {SaveButton}
    </>
  );
}

