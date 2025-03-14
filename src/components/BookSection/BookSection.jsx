import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import "./BookSection.css";

function BookSection({ books }) {
  return (
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
  );
}

export default BookSection;
