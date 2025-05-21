import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import { useState } from "react"; // Import useState để quản lý trạng thái phân trang
import "./HomePageBookSection.css";

function HomePageBookSection({ books }) {
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
        {books.slice(0, 8).map((book) => (
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

            {book.author && <p className="book-author">{book.author}</p>}

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
    </div>
  );
}

export default HomePageBookSection;
