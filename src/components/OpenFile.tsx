import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import Popup from 'reactjs-popup';
import { IoClose } from 'react-icons/io5';
import Link from 'next/link';
import FileService from '../../services/firebaseFile';
import UserService from '../../services/firebaseUser';
import { CurrentUser } from '@/types/CurrentUser';

import { getAuth, onAuthStateChanged} from "firebase/auth";
import app from "../../firebaseConfig";

interface OpenFileProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  fileUrl: string;
}

const OpenFile: React.FC<OpenFileProps> = ({ isOpen, onClose, fileId, fileUrl}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [canOpenFile, setCanOpenFile] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
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




  const handleOpenFile = async () => {
    if (!user) {
      // Show popup to ask the user to log in
      setIsPopupOpen(true);
      return;
    }

    try {
      const fileAccessedBefore = await FileService.hasUserAccessedFileBefore(user.uid, fileId);
      //old materials he 'payed' to access will still be accessible even if current limit is reached
      //only the new ones will be hidden from access
      if (user.downloadCount >= user.uploadCount * 5 && !fileAccessedBefore) {
        // Show popup to ask the user to upload more files
        setIsPopupOpen(true);
        return;
      }

      // Allow the iframe to render
      setCanOpenFile(true);

      if (!fileAccessedBefore) {
	UserService.incrementDownloadCount(user.uid);
      }
      await FileService.checkAndLogFileAccess(user.uid, fileId);
    } catch (error) {
      console.error("Error handling file open:", error);
      alert('not your fault, system experiencing technical diffulties');
    }
  };

  const handleUploadClick = () => {
    // Navigate to the upload page
    setIsPopupOpen(false);
    // Redirect to upload page
  };


  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white rounded-lg p-6 relative w-full h-full">
            <button className="absolute top-2 right-2" onClick={onClose}>
              <FaTimes />
            </button>
            {!canOpenFile ? (
              <div>
                {/* Show a loading or processing state until the checks are complete */}
                <p>Checking file access...</p>
                <button onClick={handleOpenFile} className="mt-2 bg-blue-500 text-white py-2 px-4 rounded">
                  Open File
                </button>
              </div>
            ) : (
              <iframe
                src={fileUrl}
                title="Document Viewer"
                className="w-full h-full"
                frameBorder="0"
              />
            )}
          </div>
        </div>
      )}
      <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} position="top center">
        <div className="p-4 bg-white shadow-lg rounded-lg">
          {user ? (
            user.uploadCount === 0 ? (
              <div>
                <p>You haven&apost uploaded any files yet! Please upload a file to unlock access.</p>
                <button onClick={handleUploadClick} className="mt-2 bg-blue-500 text-white py-2 px-4 rounded">
                  <Link href={'/upload'}>Upload Now</Link>
                </button>
                <button onClick={() => setIsPopupOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                  <IoClose size={24} />
                </button>
              </div>
            ) : user.downloadCount >= user.uploadCount * 5 ? (
              <div>
                <p>You have exceeded your download limit. Please upload more files to unlock access.</p>
                <button onClick={handleUploadClick} className="mt-2 bg-blue-500 text-white py-2 px-4 rounded">
                  <Link href={'/upload'}>Upload Now</Link>
                </button>
                <button onClick={() => setIsPopupOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                  <IoClose size={24} />
                </button>
              </div>
            ) : (
              <div>
                <p>Your file is opening...</p>
              </div>
            )
          ) : (
            <div>
              <p>Please log in or sign up to open files.</p>
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
    </>
  );
};

export default OpenFile;

