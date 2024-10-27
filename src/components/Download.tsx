"use client";
import 'reactjs-popup/dist/index.css';
import React, { useState, useEffect} from 'react';
import Popup from 'reactjs-popup';
import { FaDownload } from "react-icons/fa"; // Icons from react-icons
import { IoClose } from 'react-icons/io5';
import Link from 'next/link';
import { CurrentUser } from '@/types/CurrentUser';
import FileService from '../../services/firebaseFile';
import UserService from '../../services/firebaseUser';

import { getAuth, onAuthStateChanged} from "firebase/auth";
import app from '../../firebaseConfig';


interface DownloadProps {
  user?: CurrentUser | null;
  fileUrl ?: string;
  fileId:string;
  fileName ?: string;
  currUser ?: CurrentUser;
}

export default function Download({ currUser, fileUrl, fileName, fileId }: DownloadProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [user, setUser] = useState(currUser);
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (userFromAuth) => {
	    if(userFromAuth){
		    const userData = await UserService.getUserData(userFromAuth.uid || '');
		    if (userData) {
			    setUser({
				    uid: userFromAuth.uid,
				    uploadCount: userData.uploadCount,
				    downloadCount: userData.downloadCount,
			    });
		    }
	    }
    }
  );
    return () => unsubscribe();
  }, []);

  const handleDownloadClick = async () => {
    if (!user) {
      // Show a message asking the user to log in or sign up
      setIsPopupOpen(true);
      return;
    }

    const accessedBefore = await FileService.hasUserAccessedFileBefore(user.uid, fileId);
    if (user.downloadCount < user.uploadCount * 5 || accessedBefore) {
      // Proceed with file download
      setIsDownloading(true);
      setProgress(0);
      try {
	      const downloadInterval = setInterval(() => {
		      setProgress((prev) => {
			      if (prev >= 100) {
				      clearInterval(downloadInterval);
				      setIsDownloading(false);
				      return 100;
			      }
			      return prev + 10;
		      });
	      }, 300); // Increase progress every 300ms

	     await FileService.downloadFile(fileName || '', fileUrl || '');
	     if (!accessedBefore){
		     await UserService.incrementDownloadCount(user.uid);
	     }else{
		     console.log(`fileId ${fileId} never been accessedBefore by this user, so increaseDownloadCOunt`);
	     }
	     await FileService.checkAndLogFileAccess(user.uid, fileId)
	     setIsPopupOpen(false);
	     setIsDownloading(false);
      } catch (error) {
        console.error('Error downloading file:', error);
	     await UserService.incrementDownloadCount(user.uid);
	setIsDownloading(false);
      }

      setIsPopupOpen(false);
    } else {
      // Show popup to upload more files
      setIsPopupOpen(true);
    }
  };

  const handleUploadClick = () => {
    // Navigate to the file upload page
    setIsPopupOpen(false); // Close the popup and start the upload process
  };


  const DownloadButton = (
    <button onClick={handleDownloadClick} className="flex items-center space-x-1 text-blue-500 hover:text-blue-700">
      <FaDownload />
      <span className='hidden sm:inline'>Download</span>
    </button>
  );
return (
  <>
    <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} position="top center">
      <div className="p-4 bg-white shadow-lg rounded-lg">
        {user ? (
          user.uploadCount === 0 ? (
            <div>
              <p>Looks like you haven&apost uploaded any files yet! To unlock your download access, simply upload a file. For every file you share, you can download up to 5 materials. Let&aposs get sharing!</p>
              <button onClick={handleUploadClick} className="mt-2 bg-blue-500 text-white py-2 px-4 rounded">
	      {/*direct use to signIn first before downloading*/}
                <Link href={'/upload'}>Upload Now</Link>
              </button>
              <button onClick={() => setIsPopupOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                <IoClose size={24} />
              </button>
            </div>

          ) : user.downloadCount  < user.uploadCount  * 5? (
	  isDownloading && (
		<div className="mt-2">
		<div className="relative w-full h-4 bg-gray-200 rounded">
			<div
		         className="absolute left-0 top-0 h-full bg-blue-500 rounded"
			 ></div>
		</div>
		<p className="text-sm text-gray-500 mt-1">{progress}%</p>

		</div>
	      )
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
