import React from "react";
import "./Pagination.css";

function Pagination({ totalPages, currentPage, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 1) return pages;

    pages.push(1);

    if (currentPage > 3) pages.push("...");

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage + 2 < totalPages) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const handleClick = (page) => {
    if (page !== "...") {
      onPageChange(page - 1); // chuyển page từ 1-based về 0-based
    }
  };

  return (
    <div className="pagination">
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
      >
        {"<"}
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          className={page === currentPage + 1 ? "active" : ""}
          onClick={() => handleClick(page)}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {">"}
      </button>
    </div>
  );
}

export default Pagination;
