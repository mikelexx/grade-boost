import Link from "next/link";
import SignUpButtonClient from "@/components/SignupButtonClient";
import UploadButton from "@/components/UploadButton";
export default function About() {
  return (
    <>
      <nav className="fixed top-0 left-0 shadow-lg z-20 w-full flex items-center justify-between p-4 bg-gray-100 text-black ">
      <div className="flex-row space-x-4 ">
      <Link href="/" className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-pulse tracking-wide drop-shadow-lg">
      Grade<span className="text-4xl italic text-yellow-300">Boost</span>
      </Link>
      </div>
      <div className="flex space-x-4 items-center">
	<Link className="hover:underline" href="/">Back</Link>
	<SignUpButtonClient/>
	<UploadButton />
	{/*
	<div className="relative">
          <select defaultValue='English' className="mt-1 rounded-md border-gray-300 bg-white text-black ">
            <option value="English">English</option>
            <option value="Swahili">Swahili</option>
          </select>
        </div>
	*/}
      </div>
    </nav>

      <section className="mt-28 bg-white p-6 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">About GradeBoost</h1>
          <p className="mb-4">
            GradeBoost is designed to provide students with a comprehensive platform for accessing study materials from various learning institutions. Our mission is to enhance learning by providing easy access to essential resources such as lecture notes, assignments, past papers, marking schemes, and exam solutions.
          </p>
          <h2 className="text-3xl font-semibold mt-6 mb-2">Why Choose GradeBoost?</h2>
          <p className="mb-4">
            Unlike existing platforms, GradeBoost focuses on user-generated content, allowing students to contribute and share their materials. This collaborative approach not only enhances the variety of resources available but also fosters a community of learners supporting one another.
          </p>
          <h2 className="text-3xl font-semibold mt-6 mb-2">Our Aims</h2>
          <p className="mb-4">
            Our primary aim is to create an accessible and user-friendly platform where students can easily find and share study materials. We strive to make studying more efficient and less stressful, ultimately helping students achieve better academic results.
          </p>
          <h2 className="text-3xl font-semibold mt-6 mb-2">Get Involved</h2>
          <p>
            We encourage users to upload their materials and contribute to the GradeBoost community. By sharing even a single file, you can help others access the resources they need, while also gaining the ability to download materials yourself. Together, we can build a rich repository of study materials that benefit everyone.
          </p>
        </div>
      </section>
    </>
  );
}

