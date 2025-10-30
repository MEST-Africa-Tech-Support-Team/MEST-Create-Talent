export default function NotFound() {
  return (
    <>
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-[#B627A1] text-white rounded-lg hover:bg-[#834d7b] transition"
      >
        Go Back Home
      </a>
    </div>
    </>
  );
}