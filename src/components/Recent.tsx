import { FaDownload, FaSave, FaFolderOpen } from "react-icons/fa"; // Icons from react-icons
import Image from "next/image";
interface RecentItem{
	id: string,
	title: string,
	thumbnailUrl: string,
	materialType: string,
	author: string,
	uploadDate: Date
}

// Utility function to format the time difference
function timeAgo(uploadDate: string | Date) {
  const now = new Date();
  const postedDate = new Date(uploadDate);
  const diff = now.getTime() - postedDate.getTime(); // difference in milliseconds

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
}

export default function RecentItems({ recentItems }: { recentItems: RecentItem[] }) {
  return (
    recentItems && (
    <section>
      <h2 className=" text-center text-2xl font-semibold mb-6 mx-auto">Recent Activities</h2>
      <div className="grid  grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
        {recentItems.map((item) => (
          <div
            key={item.id}
            className="bg-white text-black p-6 mb-6 border border-black border-opacity-20 rounded-lg flex flex-col items-start space-y-4"
          >
            {/* Top part of card: Author and type */}
            <div className="flex items-center space-x-4">
              <Image
                src="/images/small.jpeg" // Replace with actual author profile URL if available
                alt={`${item.author} profile picture`}
                width={40}
                height={40}
                className="rounded-full"
              />
              <p>
                <span className="font-semibold text-green">{item.author}</span> posted {item.materialType.endsWith('s')
			? ""
			: ['a', 'e', 'i', 'o', 'u'].includes(item.materialType.at(0).toLowerCase())
				? 'an'
				: 'a'
		}{" "}{item.materialType}
		<br/>
			<span className="font-semibold">{timeAgo(item.uploadDate)} </span>
		      </p>
            </div>

            {/* Middle part of card: Material thumbnail */}
            <div className="w-full">
              <Image
                src={item.thumbnailUrl}
                alt={`${item.title} thumbnail`}
                width={400} // Adjust based on design
                height={400} // Adjust based on design
                className="w-full h-auto object-cover rounded"
              />
            </div>

            {/* Bottom part of card: Title and actions */}
            <div className="w-full">
              <p className="font-bold text-lg mb-2">{item.title}</p>
              <hr className="border-t border-gray-300 mb-4" />
              {/* Action buttons */}
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-blue-500 hover:text-blue-700">
                  <FaDownload />
                  <span>Download</span>
                </button>

                <button className="flex items-center space-x-1 text-green-500 hover:text-green-700">
                  <FaSave />
                  <span>Save</span>
                </button>

                <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-700">
                  <FaFolderOpen />
                  <span>Open</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </section>
    )
  );
}
