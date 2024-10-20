"use client"
import React, { useState, useEffect } from 'react';
import { FaDownload, FaFolderOpen, FaTrashAlt, FaShareAlt } from 'react-icons/fa'; // Icons from react-icons
import OpenFile from './OpenFile';
import Download from './Download';
import FileService from '../../services/firebaseFile';
import UserService from '../../services/firebaseUser';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from "../../firebaseConfig";
import { CurrentUser } from "@/types/CurrentUser";
import { useRouter } from 'next/navigation';

interface SavedMaterial {
  id: string;
  authorId: string;
  fileName: string;
  materialType: string;
  courseCode?: string;
  fileUrl: string;
  thumbnailUrl: string;
  savedAt: Date;
}

export default function SavedMaterials() {
  const [savedMaterials, setSavedMaterials] = useState<SavedMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currUser, setCurrUser] = useState<CurrentUser | null>(null);
  const [isOpenFileOpen, setOpenFileOpen] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string>('');
  const router = useRouter();

  const handleOpen = (fileUrl: string) => {
    setOpenFileOpen(true); // Open the modal
    setSelectedFileUrl(fileUrl);
  };

  const handleClose = () => {
    setOpenFileOpen(false); // Close the modal
    setSelectedFileUrl('');
  };


  useEffect(() => {
    const auth = getAuth(app);

    // Monitor authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userData = await UserService.getUserData(user.uid);
          if (userData) {
            setCurrUser({
              downloadCount: userData.downloadCount,
              uploadCount: userData.uploadCount,
              uid: user.uid,
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setCurrUser(null); // No user is signed in
      }
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, []);
async function fetchSavedMaterials() {
}


  useEffect(() => {
	  const fetchSavedMaterials = async () => {
		  if (currUser) {
			  setIsLoading(true);
			  console.log('Current user is:', currUser);
			  try {
				  // Fetch saved materials for the current user
				  const materials = await FileService.getSavedMaterials(currUser.uid);
				  setSavedMaterials(materials);
			  } catch (error) {
				  console.error('Error fetching saved materials:', error);
			  } finally {
				  setIsLoading(false);
			  }
		  }
	  }
	fetchSavedMaterials();
  }, [currUser]);

const handleRemoveClick = async (fileId: string, userId: string) => {
  try {
    if (fileId && userId) {
      await FileService.removeSavedMaterial(fileId, userId);
      localStorage.removeItem(`saved_${fileId}`)
      setSavedMaterials(savedMaterials.filter(material=>material.id !== fileId));
    } else {
      console.error('User ID or Material ID is undefined');
    }
  } catch (error) {
    console.error('Error removing material:', error);
  }
};

  if (isLoading) {
    return <div className="flex min-h-screen justify-center items-center h-full">Loading saved materials...</div>;
  }

  if (savedMaterials.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center h-full text-gray-600">
       <button onClick={() => router.back()} className="mb-4 text-blue-500 hover:underline">
	  Back
       </button>
        <h2 className="text-xl font-semibold">No Saved Materials</h2>
        <p className="mt-2">You haven't saved any materials yet. Explore materials and save them for later access.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen container min-w-screen mx-auto py-8">
      <button onClick={() => router.back()} className="mb-4 text-blue-500 hover:underline">
          Back
      </button>
      <h1 className="text-2xl font-semibold mb-4">Saved Materials</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedMaterials.map((material) => (
          <div key={material.id} className="bg-white p-4 shadow-md rounded-lg">
            <img src={material.thumbnailUrl} alt={material.fileName} className="w-full h-48 object-cover mb-4 rounded" />
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold truncate">{material.fileName}</h2>
              <span className="text-sm text-gray-500">{material.materialType}</span>
            </div>
            {material.courseCode && <p className="text-sm text-gray-500">Course Code: {material.courseCode}</p>}
            <div className="flex justify-between mt-4">
              <button onClick={() => handleOpen(material.fileUrl)} className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-700">
                <FaFolderOpen /> <span className="ml-1">Open</span>
              </button>
              <Download fileUrl={material.fileUrl} currUser={currUser} />
              <button className="text-red-500 hover:text-red-700" onClick={() => handleRemoveClick(material.id, currUser.uid)}>
                <FaTrashAlt /> <span className="ml-1">Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <OpenFile isOpen={isOpenFileOpen} onClose={handleClose} fileUrl={selectedFileUrl} />
    </div>
  );
}

