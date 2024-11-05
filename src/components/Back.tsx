"use client"
import { useRouter } from 'next/navigation';

export default function Backbutton(){
	const router =  useRouter();
	function handleOnclick(){
		router.back();
	}

	return <>
	<button className="flex items-center px-4 py-2 bg-gray-200 rounded text-black"
	onClick={handleOnclick}><span className="align-middle mr-2 mb-2">&larr;</span>Back</button>
	</>
}
