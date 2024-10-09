import Search from "@/components/Search";
import Categories from "@/components/Categories";
import RecentItems from "@/components/Recent";
import Features from "@/components/Features";
import NavBar from "@/components/NavBar";

const fields = [
  { name: "Engineering", departments: ["Agriculture", "Electrical Engineering", "Mechanical Engineering"] },
  { name: "Science", departments: ["Biology", "Chemistry", "Earth and Space Science"] },
  { name: "Maths", departments: ["Algebra", "Calculus", "Basic Math", "Geometry", "Precalculus"] },
  {name: 'Medicine', departments: []}
];
const recentItems  = [
  {
    id: '1',
    title: "Electrical Engineering Assignment",
    thumbnailUrl: "/images/fakeThumbnail.jpeg", // Fake thumbnail
    materialType: 'Assignment',
    author: 'michael',
    uploadDate: new Date('07/06/2024')
  },
  {
    id: '2',
    title: "Biology Lecture Notes",
    thumbnailUrl: "/images/fakeThumbnail.jpeg", // Fake thumbnail
    materialType: 'Notes',
    author: 'lexx mike',
    uploadDate: new Date()
  },
  {
    id: '3',
    title: "Calculus Past Paper",
    thumbnailUrl: "/images/fakeThumbnail.jpeg", // Fake thumbnail
    materialType: 'pastPaper',
    author: 'murithi',
    uploadDate: new Date()
  },
];
export default function Home() {
  return (
    <>
    <NavBar/>
      <section className="hero bg-black text-white text-center p-8 relative min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Master Your Exams with the Right Study Resources!
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Access notes, assignments, past papers, and more—everything you need to succeed.
          </p>
        </div>
        <Search />
      </section>
      <Categories fields={fields}/>
      <RecentItems recentItems={recentItems}/>
      <Features/>

    </>
  );
}
