const NotFound = () => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <div>
          <h1 className="text-6xl font-bold text-blue-600">404</h1>
          <h2 className="text-2xl mt-4 font-semibold text-gray-800">Page Not Found</h2>
          <p className="mt-2 text-gray-600">
            Oops! The page you are looking for doesn't exist or access is restricted.
          </p>
          <a
            href="/"
            className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  };
  
  export default NotFound;
  