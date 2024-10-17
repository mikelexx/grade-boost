import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface OpenFileProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
}

const OpenFile: React.FC<OpenFileProps> = ({ isOpen, onClose, fileUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-white rounded-lg p-6 relative w-full h-full">
        <button className="absolute top-2 right-2" onClick={onClose}>
          <FaTimes />
        </button>
        <iframe
          src={fileUrl}
          title="Document Viewer"
          className="w-full h-full" // Change height to full
          frameBorder="0"
        />
      </div>
    </div>
  );
};

export default OpenFile;

