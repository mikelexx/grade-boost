import Image from 'next/image';
import timeAgo from '../../utils';
import { FaFolderOpen } from "react-icons/fa"; // Icons from react-icons
import Download from '@/components/Download';
import { useState } from 'react';
import { FileMaterial } from '@/types/FileMaterial'; // Import FileMaterial instead of Result
import OpenFile from './OpenFile';
import UserService from '../../services/firebaseUser';
import Save from './Save';

interface SearchResultCardProps {
  result: FileMaterial; // Use FileMaterial type here
}

export default function SearchResultCard({ result }: SearchResultCardProps) {
  const [isOpenFileOpen, setOpenFileOpen] = useState(false); // State to manage modal visibility

  const handleOpen = () => {
    setOpenFileOpen(true); // Open the modal
  };

  const handleClose = () => {
    setOpenFileOpen(false); // Close the modal
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6 flex flex-col md:flex-row border-t-2 ">
      {/* Image thumbnail */}
      <Image
        src={result.thumbnailUrl || '/images/defaultThumbnail.jpeg'}
        alt="Material Thumbnail"
        width={500}
        height={300}
        className="w-full h-48 rounded-lg object-cover mb-4 md:mb-0 md:w-1/3"
      />

      {/* Info Section */}
      <div className="flex flex-col justify-between w-full md:ml-6">
        <div className="flex items-center mb-4">
	{/*
          <Image
            src={result.authorPhotoUrl || '/images/defaultUser.jpeg'}
            alt="Author"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full mr-4"
          />
		*/}
          <div>
            <h4 className="text-lg font-semibold">{result.fileName}</h4>
            <p className="text-gray-500 text-sm">
              {result.materialType} • {timeAgo(result.uploadedAt)}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-4 w-full justify-between">
          <button onClick={handleOpen} className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-700">
            <FaFolderOpen />
            <span className="hidden sm:inline">Open</span> {/* Hide text on small screens */}
          </button>

          <Download fileUrl={result.fileUrl} fileName={result.fileName} fileId={result.id || ''} />
          <Save currUser={UserService.getCurrentUser()} fileId={result.id || ''} />
          {/* Kebab menu */}
          <button className="text-gray-400 text-xl">⋮</button>
        </div>
      </div>
      {/* OpenFile for opening the file */}
      <OpenFile fileId={result.id || ''} isOpen={isOpenFileOpen} onClose={handleClose} fileUrl={result.fileUrl} />
    </div>
  );
}

