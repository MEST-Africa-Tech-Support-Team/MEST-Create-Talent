import React from 'react';

export default function TalentPagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];

  // Generate an array of page numbers to display
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center my-8">
      <nav className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-gray-200 disabled:opacity-50 cursor-pointer"
        >
          Previous
        </button>

        {/* Page numbers mapping */}
        {pages.map((page) => (
          <button
            key={page} // The key is the unique page number
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              currentPage === page
                ? "bg-[#28BBBB] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-gray-200 disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </nav>
    </div>
  );
}