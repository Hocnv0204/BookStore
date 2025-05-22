import React from "react";
import "./Pagination.css";

const Pagination = ({
  pageNumber = 0,
  pageSize = 10,
  totalElements = 0,
  totalPages = 1,
  last = true,
  onPageChange,
}) => {
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      onPageChange(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Hiển thị {pageNumber * pageSize + 1} -{" "}
        {Math.min((pageNumber + 1) * pageSize, totalElements)} của{" "}
        {totalElements} kết quả
      </div>
      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 0}
        >
          <i className="fas fa-chevron-left">{"<"}</i>
        </button>
        <div className="page-numbers">
          {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
            <button
              key={page}
              className={`page-number ${page === pageNumber ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page + 1}
            </button>
          ))}
        </div>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={last}
        >
          <i className="fas fa-chevron-right">{">"}</i>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
