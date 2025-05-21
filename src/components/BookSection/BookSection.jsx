import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import { useState, useEffect } from "react"; // Import useState và useEffect để quản lý trạng thái phân trang
import "./BookSection.css";

function BookSection({ books, totalPages = 1, currentPage = 0, onPageChange }) {
  // Thêm useEffect để scroll to top khi books thay đổi
  useEffect(() => {
    if (books && Array.isArray(books)) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [books]);

  if (!books || !Array.isArray(books)) {
    return (
      <div className="no-books-message">
        Đang tải sách... hoặc không có sách.
      </div>
    );
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      onPageChange(newPage);
    }
  };

  // Tạo mảng các số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Số trang tối đa hiển thị

    if (totalPages <= maxVisiblePages) {
      // Nếu tổng số trang ít hơn maxVisiblePages, hiển thị tất cả
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Luôn hiển thị trang đầu tiên
      pageNumbers.push(0);

      // Tính toán các trang ở giữa
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages - 2, currentPage + 1);

      // Điều chỉnh để luôn hiển thị đủ maxVisiblePages
      if (startPage === 1) {
        endPage = Math.min(totalPages - 2, maxVisiblePages - 2);
      } else if (endPage === totalPages - 2) {
        startPage = Math.max(1, totalPages - maxVisiblePages + 1);
      }

      // Thêm dấu ... nếu cần
      if (startPage > 1) {
        pageNumbers.push("...");
      }

      // Thêm các trang ở giữa
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Thêm dấu ... nếu cần
      if (endPage < totalPages - 2) {
        pageNumbers.push("...");
      }

      // Luôn hiển thị trang cuối cùng
      pageNumbers.push(totalPages - 1);
    }

    return pageNumbers;
  };

  return (
    <div>
      <div className="book-grid">
        {books.map((book) => (
          <Link
            to={`/product/${book.id}`} // Đường dẫn động đến trang chi tiết sản phẩm
            key={book.id}
            className="book-card"
          >
            <div className="book-image-container">
              <img
                src={book.imageUrl || "/placeholder.svg"}
                alt={book.title}
                className="book-image"
              />
              {book.discount > 0 && (
                <div className="discount-badge">-{book.discount}%</div>
              )}
            </div>

            <h3 className="book-title">{book.title}</h3>

            {book.authorName && (
              <p className="book-author">{book.authorName}</p>
            )}

            <div className="book-price">
              <span className="current-price">
                {book.price.toLocaleString()}đ
              </span>
              {book.originalPrice > book.price && (
                <span className="original-price">
                  {book.originalPrice.toLocaleString()}đ
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="pagination-button"
        >
          Trước
        </button>

        <div className="page-numbers">
          {getPageNumbers().map((pageNum, index) =>
            pageNum === "..." ? (
              <span key={`ellipsis-${index}`} className="page-ellipsis">
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`page-number ${
                  currentPage === pageNum ? "active" : ""
                }`}
              >
                {pageNum + 1}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="pagination-button"
        >
          Sau
        </button>
      </div>
    </div>
  );
}

export default BookSection;
