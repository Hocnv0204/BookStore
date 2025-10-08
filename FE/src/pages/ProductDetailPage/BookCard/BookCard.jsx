import React from "react";
import "./BookCard.css";

function BookCard({ book }) {
  if (!book) {
    return <div className="book-card">Không có dữ liệu sách</div>;
  }
  return (
    <div className="book-card">
      {book.discount && <div className="sale-badge">{book.discount}</div>}
      <img
        src={book.image || "/placeholder.svg"}
        alt={book.title}
        className="book-image"
      />
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <div className="book-price">
          {book.price.toLocaleString()}
          <sup>đ</sup>
        </div>
        {book.originalPrice && (
          <div className="book-original-price">
            {book.originalPrice.toLocaleString()}
            <sup>đ</sup>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookCard;
