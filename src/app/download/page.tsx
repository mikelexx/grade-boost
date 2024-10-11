"use client"
import Download from "@/components/Download";
export default function YourComponent(){
	const currUser = {
		isauthenticated: true, // Boolean value for authentication status
		uploadsCount: 1,       // Number of uploads
		downloadsCount: 5,     // Number of downloads
	};
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Upload Your File</h1>
      <Download currUser={currUser}/>
    </div>
  );
};

