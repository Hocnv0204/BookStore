import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import { useState, useEffect } from "react"; // Import useState và useEffect để quản lý trạng thái phân trang
import "./BookSection.css";
import Pagination from "../Pagination/Pagination";

function BookSection({
  books,
  pageNumber = 0,
  pageSize = 8,
  totalElements = 0,
  totalPages = 1,
  last = true,
  onPageChange,
  showPagination = false,
}) {
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

  return (
    <div>
      <div className="book-grid">
        {books.map((book) => (
          <Link to={`/product/${book.id}`} key={book.id} className="book-card">
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

      {showPagination && (
        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalElements={totalElements}
          totalPages={totalPages}
          last={last}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

export default BookSection;
