"use client"
import { useState } from 'react';
import { FaUpload } from 'react-icons/fa';

const FileUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [materialType, setMaterialType] = useState('');
  const [courseCode, setCourseCode] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !materialType || !courseCode) {
      alert('Please fill in all fields');
      return;
    }

    // Handle file upload logic
    console.log('File uploading:', selectedFile);
    console.log('Material Type:', materialType);
    console.log('Course Code:', courseCode);
  };

  const handleCancel = () => {
    // Reset the form
    setSelectedFile(null);
    setMaterialType('');
    setCourseCode('');
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-semibold mb-4">Upload Your File</h2>

      <form onSubmit={handleSubmit}>
        {/* File Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select File</label>
          <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 mt-2">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              className="hidden"
              onChange={handleFileChange}
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <FaUpload className="text-gray-400 w-12 h-12" />
              <span className="text-gray-500">Drag & drop your file here or click to select</span>
            </label>
          </div>
          {selectedFile && <p className="mt-2 text-sm text-gray-600">Selected: {selectedFile.name}</p>}
        </div>

        {/* Material Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Material Type</label>
          <select
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" disabled>Select material type</option>
            <option value="assignment">Assignment</option>
            <option value="notes">Notes</option>
            <option value="past-papers">Past Papers</option>
            <option value="solutions">Solutions</option>
          </select>
        </div>

        {/* Course Code */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Course Code / Unit Name</label>
          <input
            type="text"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            placeholder="Enter the course code or unit name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};
export default FileUploadForm;
