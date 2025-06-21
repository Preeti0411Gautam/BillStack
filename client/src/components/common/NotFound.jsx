import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4 py-10 text-center">
      {/* Image */}
      <img
        src="/404.png"
        alt="404 Not Found"
        className="mb-8"
      />

      {/* Heading */}
      <h1 className="text-2xl sm:text-6xl font-extrabold text-gray-800 mb-4">
        404 - Page Not Found
      </h1>

      {/* Description */}
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>

      {/* Back Home Button */}
      <Link
        to="/"
        className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-300 text-lg font-semibold shadow-md"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
