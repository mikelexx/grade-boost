import Image from 'next/image';
import { FaDownload, FaSave, FaFolderOpen, FaShareAlt, FaEye} from "react-icons/fa"; // Icons from react-icons
import ResultsPageNavBar from "@/components/ResultsPageNavBar";
import Download from '@/components/Download';

const mockResults = [
  {
    id: 1,
    title: "Math Past Paper",
    materialType: "pastpapers",
    downloads: "3k",
    time: "2 days ago",
    thumbnailUrl: "/images/fakeThumbnail.jpeg",
    authorImg: "/images/small.jpeg",
  },
  {
    id: 2,
    title: "Physics Assignment",
    materialType: "assignments",
    downloads: "2k",
    time: "3 days ago",
    thumbnailUrl: "/images/fakeThumbnail.jpeg",
    authorImg: "/images/small.jpeg",

  },
  {
    id: 3,
    title: "Physics Assignment",
    materialType: "assignments",
    downloads: "2k",
    time: "3 days ago",
    thumbnailUrl: "/images/fakeThumbnail.jpeg",
    authorImg: "/images/small.jpeg",
  },
  {
    id: 4,
    title: "Physics Assignment",
    materialType: "assignments",
    downloads: "2k",
    time: "3 days ago",
    thumbnailUrl: "/images/fakeThumbnail.jpeg",
    authorImg: "/images/small.jpeg",
  },
  {
    id: 5,
    title: "Physics Assignment",
    materialType: "assignments",
    downloads: "2k",
    time: "3 days ago",
    thumbnailUrl: "/images/fakeThumbnail.jpeg",
    authorImg: "/images/small.jpeg",
  },

];


export default function ResultsObsolete() {
  return (
    <>
      <ResultsPageNavBar />
      <div className='flex-col pt-16 bg-white p-6'>
      <h1 className='break-words text-center text-center text-2xl md:text-3xl font-semibold mb-6'>Results for 'Ecu 404 maths pastpapers' </h1>
     <div className="flex gap-6 bg-white">
        {/* Left Sidebar */}
	<aside className="sticky top-20 w-1/4  p-6 mb-auto border border-black border-opacity-20">

	  <h3 className="text-xl font-semibold mb-4">Material Types</h3>
	  <div>
	    <label className="flex justify-between items-center py-2">
	      <span>Past Papers (5)</span>
	      <input type="checkbox" className="self-centerform-checkbox text-blue-600" value="pastpapers" />
	    </label>
	    <hr className="border-gray-300" />
	    <label className="flex justify-between items-center py-2">
	      <span>Assignments (3)</span>
	      <input type="checkbox" className="form-checkbox text-blue-600" value="assignments" />
	    </label>
	    <hr className="border-gray-300" />
	    <label className="flex justify-between items-center py-2">
	      <span>Notes (8)</span>
	      <input type="checkbox" className="form-checkbox text-blue-600" value="notes" />
	    </label>
	    <hr className="border-gray-300" />
	    <label className="flex justify-between items-center py-2">
	      <span>Solutions (6)</span>
	      <input type="checkbox" className="form-checkbox text-blue-600" value="solutions" />
	    </label>
	  </div>
	</aside>

        {/* Right Results Section */}
        <section className="w-3/4 h-full overflow-y-auto">
          {mockResults.map((result) => (
            <div key={result.id}
                 className="bg-white p-6 rounded-lg shadow mb-6 flex flex-col md:flex-row">
              {/* Image thumbnail */}
              <Image
                src={result.thumbnailUrl}
                alt="Material Thumbnail"
                width={500}
                height={300}
                className="w-full h-48 rounded-lg object-cover mb-4 md:mb-0 md:w-1/3"
              />

              {/* Info Section */}
              <div className="flex flex-col justify-between w-full md:ml-6">
                <div className="flex items-center mb-4">
                  <Image
                    src={result.authorImg}
                    alt="Author"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="text-lg font-semibold">{result.title}</h4>
                    <p className="text-gray-500 text-sm">
                      {result.downloads} downloads • {result.time}
                    </p>
                  </div>
                </div>
              {/* Action buttons */}
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-700">
                  <FaFolderOpen />
                  <span>Open</span>
                </button>
		{/* <button className="flex items-center space-x-1 text-blue-500 hover:text-blue-700">
                  <FaDownload />
                  <span>Download</span>
                </button> */}
	       <Download/>

                <button className="flex items-center space-x-1 text-green-500 hover:text-green-700">
                  <FaSave />
                  <span>Save</span>
                </button>
		<button className="flex items-center space-x-1 text-blue-500 hover:text-blue-700">
		<FaShareAlt className="mr-2" /> Share
		</button>
		{/*kebab-menu*/}
                  <button className="text-gray-400 text-xl">⋮</button>
              </div>
              </div>
            </div>
          ))}
        </section>
      </div>
      </div>
    </>
  );
}
