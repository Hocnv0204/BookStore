import React from "react";
import "./Pagination.css";

function Pagination({ totalPages, currentPage }) {
  // Logic to determine which page numbers to show
  const getPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Show current page and surrounding pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 2 && currentPage > 3) {
        pages.push("...");
      } else {
        pages.push(i);
      }
    }

    // Show ellipsis if needed
    if (currentPage + 2 < totalPages) {
      pages.push("...");
    }

    // Always show last page if not already included
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="pagination">
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          className={page === currentPage ? "active" : ""}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}
      <button>Cuối</button>
    </div>
  );
}

export default Pagination;
