import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
  to="/"
  className="mt-6 inline-block bg-red-800 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-300 text-center font-semibold shadow-md"
>
  Return to Home
</Link>

    </div>
  );
};

export default NotFound;