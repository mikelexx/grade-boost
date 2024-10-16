"use client";
import 'reactjs-popup/dist/index.css';
import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { FaDownload } from "react-icons/fa"; // Icons from react-icons
import { IoClose } from 'react-icons/io5';
import Link from 'next/link';
import { CurrentUser } from '@/types/CurrentUser';

interface DownloadProps {
  currUser?: CurrentUser | null;
}

export default function Download({ currUser }: DownloadProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDownloadClick = () => {
    if (!currUser) {
      // Show a message asking the user to log in or sign up
      setIsPopupOpen(true);
      return;
    }

    if (currUser.downloadCount < currUser.uploadCount * 3) {
      // Proceed with file download
      console.log(`uploads ${currUser.uploadCount}, downlaods: ${currUser.downloadCount} `);
      console.log('File is downloading...');
      // Simulate download and close popup
      setIsPopupOpen(false);
    } else {
      // Show popup to upload more files
      setIsPopupOpen(true);
    }
  };

  const handleUploadClick = () => {
    // Navigate to the file upload page
    setIsUploading(true);
    setIsPopupOpen(false); // Close the popup and start the upload process
  };

  const handleLoginClick = () => {
    // Trigger login or signup flow
    console.log('Redirecting to login/signup...');
    setIsPopupOpen(false); // Close the popup
  };

  const DownloadButton = (
    <button onClick={handleDownloadClick} className="flex items-center space-x-1 text-blue-500 hover:text-blue-700">
      <FaDownload />
      <span>Download</span>
    </button>
  );
return (
  <>
    <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} position="top center">
      <div className="p-4 bg-white shadow-lg rounded-lg">
        {currUser ? (
          currUser.uploadCount === 0 ? (
            <div>
              <p>Looks like you haven't uploaded any files yet! To unlock your download access, simply upload a file. For every file you share, you can download up to 5 materials. Let's get sharing!</p>
              <button onClick={handleUploadClick} className="mt-2 bg-blue-500 text-white py-2 px-4 rounded">
	      {/*direct use to signIn first before downloading*/}
                <Link href={'/upload'}>Upload Now</Link>
              </button>
              <button onClick={() => setIsPopupOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                <IoClose size={24} />
              </button>
            </div>
          ) : currUser.downloadCount < currUser.uploadCount * 3 ? (
            <div>
              {/* File downloading state */}
              <p>Your file is downloading...</p>
              {/* You can add a progress bar here */}
            </div>
          ) : (
            <div>
              <p>You have exceeded your download limit. To unlock your download access, please upload more files. Remember, for every file you share, you can download up to 5 materials!</p>
              <button onClick={handleUploadClick} className="mt-2 bg-blue-500 text-white py-2 px-4 rounded">
                <Link href={'/upload'}>Upload Now</Link>
              </button>
              <button onClick={() => setIsPopupOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                <IoClose size={24} />
              </button>
            </div>
          )
        ) : (
          <div>
            <p>Please log in or sign up to download files.</p>
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
    {DownloadButton}
  </>
);

}
