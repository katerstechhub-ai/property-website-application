
import Link from "next/link";
export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100" >
            <div className="text-center" >
                <h2 className="text-7xl font-bold mb-4 text-black" >
                    404: Page not found ☹️
                </h2>
                <p className="mb-5 text-gray-700">The page you are looking for does not exist.</p>
                <Link href="/" className="text-blue-500 hover:bg-blue-200 hover:text-black bg-black p-2 " >
                    Go back home
                </Link>
            </div>
        </div>
    )
}