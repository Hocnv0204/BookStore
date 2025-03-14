import React from "react";
import "./RelatedBook.css";
import { Link } from "react-router-dom";
function RelatedBooks({ title, books }) {
  return (
    <div className="section">
      <h2 className="section-title">{title}</h2>
      <div className="book-grid">
        {[1, 2, 3, 4, 5].map((item) => (
          <Link to={`/product/${item}`} key={item} className="book-card">
            <div key={item} className="book-card">
              {item % 2 === 0 && <div className="sale-badge">-20%</div>}
              <img
                src={`https://via.placeholder.com/150x200`}
                alt={`Book ${item}`}
                className="book-image"
              />
              <div className="book-info">
                <h3 className="book-title">
                  Thiên Quan Tứ Phúc - Bản Hoạt Hình Màu
                </h3>
                <div className="book-price">
                  {item * 50000}
                  <sup>đ</sup>
                </div>
                {item % 2 === 0 && (
                  <div className="book-original-price">
                    {item * 60000}
                    <sup>đ</sup>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RelatedBooks;
