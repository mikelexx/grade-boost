'use client';
import { useState, useEffect } from "react";
import { FaFolderOpen } from "react-icons/fa";
import Download from "./Download";
import Image from "next/image";
import timeAgo from "../../utils";
import FileService from "../../services/firebaseFile";
import UserService from "../../services/firebaseUser";
import { FileMaterial } from "@/types/FileMaterial"; // Import FileMaterial
import OpenFile from "./OpenFile";
import Save from './Save';

export default function RecentItems() {
  const [hydrated, setHydrated] = useState(false);
  const [recentItems, setRecentItems] = useState<FileMaterial[]>([]); // Use FileMaterial type
  const [isOpenFileOpen, setOpenFileOpen] = useState(false); // State to manage modal visibility

  const handleOpen = () => {
    setOpenFileOpen(true); // Open the modal
  };

  const handleClose = () => {
    setOpenFileOpen(false); // Close the modal
  };

  useEffect(() => {
    setHydrated(true); // Ensure component is hydrated

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
      <section  className='px-8'>
      <hr className="m-8"/>
        <h2 className="text-center text-2xl font-semibold mb-16 mx-auto">Recent Uploads</h2>
        <div className="grid grid-flow-col auto-cols-[minmax(300px,1fr)] gap-6 overflow-x-hidden">
          {recentItems.map((item) => (
            <div
              key={item.id}
              className="bg-white text-black p-6 mb-6 border border-black border-opacity-20 rounded-lg flex flex-col items-start space-y-4"
            >
              <div className="flex items-center space-x-4">
                <p className="font-bold text-lg mb-2">{item.fileName}</p>
              </div>

	      <div className="w-full h-[100px] overflow-hidden">
	      <Image
		      src={item.thumbnailUrl || '/images/defaultThumbnail.jpeg'}
		      alt={`${item.fileName} thumbnail`}
		      width={200}
		      height={100}
		      className="w-auto h-auto object-cover rounded"
	      />
	      </div>


              <div className="w-full">
	      <span className="font-semibold">posted {timeAgo(item.uploadedAt)}</span>
                <hr className="border-t border-gray-300 mb-4" />
                <div className="flex items-center space-x-4">
                  <Download fileId={item.id || ''} fileUrl={item.fileUrl} fileName={item.fileName} />
                  <Save currUser={UserService.getCurrentUser()} fileId={item.id || ''} />
                  <button onClick={handleOpen} className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-700">
                    <FaFolderOpen />
                    <span>Open</span>
                  </button>
                </div>
              </div>
              <OpenFile fileId={item.id || ''} isOpen={isOpenFileOpen} onClose={handleClose} fileUrl={item.fileUrl}  />
            </div>
          ))}
        </div>
      </section>
    )
  );
}

