"use client"
import Search from "@/components/Search";
import Categories from "@/components/Categories";
import RecentItems from "@/components/Recent";
import Features from "@/components/Features";
import NavBar from "@/components/NavBar";
import { useRouter } from 'next/navigation'; // Use next/navigation for client components

const fields = [
  { name: "Engineering", departments: ["Agriculture", "Electrical Engineering", "Mechanical Engineering"] },
  { name: "Science", departments: ["Biology", "Chemistry", "Earth and Space Science"] },
  { name: "Maths", departments: ["Algebra", "Calculus", "Basic Math", "Geometry", "Precalculus"] },
  {name: 'Medicine', departments: []}
];
export default function Home() {
	const router = useRouter();

	const handleSearch = (query: string) => {
		router.push(`/results?page=${encodeURIComponent(query)}`); // Navigate to the results page with the query
	};
	return (
    <>
    <NavBar/>
      <section className="mt-28 hero bg-black text-white text-center p-8 relative min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Master Your Exams with the Right Study Resources!
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Access notes, assignments, past papers & more
          </p>
        </div>
        <Search onSearch={handleSearch} />
      </section>
      <Categories fields={fields}/>
      <hr className="m-8"/>
      <Features/>
      <RecentItems />
      <hr className="m-8"/>
      <section className="text-center">
        <h2 className="text-center text-2xl font-semibold mb-16 mx-auto">Website Walkthrough</h2>
        <div id="demo" className="max-w-4xl mx-auto mb-8">
          <video
            controls
            className="w-full rounded-lg shadow-lg"
            src={'/videos/demo.mp4'}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
    </>

  );
}
