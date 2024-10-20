'use client';
import { useState, useEffect } from "react";
import { FaSave, FaFolderOpen } from "react-icons/fa";
import Download from "./Download";
import Image from "next/image";
import timeAgo from "../../utils";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import FileService from "../../services/firebaseFile";
import UserService from "../../services/firebaseUser";
import { CurrentUser } from "@/types/CurrentUser";
import { Result } from "@/types/Result";
import OpenFile from "./OpenFile";
import Save from './Save';



export default function RecentItems() {
  const [currUser, setCurrUser] = useState<CurrentUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [recentItems, setRecentItems] = useState<Result[]>([])
  const [isOpenFileOpen, setOpenFileOpen] = useState(false); // State to manage modal visibility

  const handleOpen = () => {
	  setOpenFileOpen(true); // Open the modal
  };
  const handleClose = () => {
	  setOpenFileOpen(false); // Close the modal
  };
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
	      try{
		      const userData = await UserService.getUserData(user.uid);
		      if (userData) {
		  setCurrUser({
		    downloadCount: userData.downloadCount,
		    uploadCount: userData.uploadCount,
		    uid: user.uid
		  });
		}
	       else {
		setCurrUser(null); // No authenticated user
	      }

	      }catch(error){
		      console.error('Error occured:', error);

	      }

      }}
  );

    setHydrated(true); // Ensure component is hydrated

    return () => unsubscribe(); // Clean up listener
  }, []);

  useEffect(() => {
    // Fetch recent materials from FileService
    const fetchRecentItems = async () => {
      try {
        const recentMaterials = await FileService.getRecentMaterials(5); // Limit to 5 items
        setRecentItems(recentMaterials);
      } catch (error) {
        console.error("Error fetching recent materials:", error);
      }
    };

    fetchRecentItems();
  }, []);

  if (!hydrated) {
    return null; // Avoid server/client mismatch
  }
return (
    recentItems.length > 0 && (
      <section>
        <h2 className="text-center text-2xl font-semibold mb-6 mx-auto">Recent Activities</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
          {recentItems.map((item) => (
            <div
              key={item.id}
              className="bg-white text-black p-6 mb-6 border border-black border-opacity-20 rounded-lg flex flex-col items-start space-y-4"
            >
              <div className="flex items-center space-x-4">
                <Image
                  src={item.authorPhotoUrl || "/images/small.jpeg"}
                  alt={`${item.authorName} profile picture`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <p>
                  <span className="font-semibold text-green">{item.authorName || 'Anonymous User'}</span> posted{" "}
                  {item.materialType.endsWith('s') ? "" : ['a', 'e', 'i', 'o', 'u'].includes(item.materialType.at(0).toLowerCase()) ? 'an' : 'a'}{" "}
                  {item.materialType}
                  <br />
                  <span className="font-semibold">{timeAgo(item.uploadedAt.toDate())} </span>
                </p>
              </div>

              <div className="w-full">
                <Image
                  src={item.thumbnailUrl}
                  alt={`${item.fileName} thumbnail`}
                  width={400}
                  height={400}
                  className="w-full h-auto object-cover rounded"
                />
              </div>

              <div className="w-full">
                <p className="font-bold text-lg mb-2">{item.fileName}</p>
                <hr className="border-t border-gray-300 mb-4" />
                <div className="flex items-center space-x-4">
                  <Download fileUrl={item.fileUrl} fileName={item.fileName} />

		  {/*
                  <button className="flex items-center space-x-1 text-green-500 hover:text-green-700">
                    <FaSave />
                    <span>Save</span>
                  </button>

			  */}
		  <Save currUser={UserService.getCurrentUser()} fileId={item.id} />

                  <button onClick={handleOpen} className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-700">
                    <FaFolderOpen />
                    <span>Open</span>
                  </button>
                </div>
              </div>
		   {/* OpenFile for opening the file */}
		   <OpenFile fileId={item.id} isOpen={isOpenFileOpen} onClose={handleClose} fileUrl={item.fileUrl} currUser={currUser} />
            </div>
          ))}
        </div>
      </section>
    )
  );
}
