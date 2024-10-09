interface SearchProps{
	isRounded?: boolean;
}
export default function Search({isRounded=true} : SearchProps){
	return <>
	<div className={` flex items-center justify-center py-8 z-50`}>
		<div className="relative w-full max-w-lg">
			<input
			type="text"
			placeholder="Search for notes, past papers, assignments..."

			className={`w-full p-4 pl-12 text-black shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRounded? 'rounded-full': 'rounded-none'} whitespace-nowrap overflow-hidden text-ellipsis` }
			/>
			<button className="absolute right-4 top-1/2 transform -translate-y-1/2">
				<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				className="w-6 h-6 text-gray-600">
				<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M21 21l-4.35-4.35m1.45-5.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
				/>
				</svg>
			</button>
		</div>
	</div>
	</>
}
