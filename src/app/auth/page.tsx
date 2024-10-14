import NavBar from "@/components/NavBar";
import Authentication from "@/components/Authentication";
export default function Authenticate(){
	return <>
	<NavBar/>
	<div className="min-h-screen">
	<Authentication/>
	</div>
	</>
}
