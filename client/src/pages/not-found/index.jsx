import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100 text-gray-900">
      <p className="text-4xl font-extrabold mb-2">Oops! Page not found.</p>
      <p className="text-lg mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <img
        src="https://static-00.iconduck.com/assets.00/404-page-not-found-illustration-2048x1985-6voscfd3.png"
        alt="Not Found"
        className="w-1/2 max-w-sm mb-8"
      />
      <Link
        to="/"
        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Go back to Home
      </Link>
    </div>
  );
}

export default NotFound;
