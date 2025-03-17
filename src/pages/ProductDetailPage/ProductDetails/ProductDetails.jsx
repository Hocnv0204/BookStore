import React from "react";
import "./ProductDetails.css";
import { Link } from "react-router-dom";
function ProductDetails({ title, author, price }) {
  return (
    <div className="product-details">
      <h1 className="product-title">{title}</h1>

      <div className="product-author">
        <span className="author-label">Tác giả:</span>
        <span className="author-name">{author}</span>
      </div>

      <div className="product-status">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="check-icon"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <span className="status-text">Tình trạng: còn hàng</span>
      </div>

      <div className="promo-box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="tag-icon"
        >
          <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
          <path d="M7 7h.01" />
        </svg>
        <span className="promo-text">
          Giảm thêm đến 10% khi nhập mã: SACH10
        </span>
      </div>

      <div className="product-price">
        {price}
        <sup>đ</sup>
      </div>

      <Link to="/cart">
        <button className="buy-button">Mua ngay</button>
      </Link>
      <div className="benefits">
        <div className="benefit-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check-icon"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span>Bọc Plastic theo yêu cầu</span>
        </div>
        <div className="benefit-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check-icon"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span>
            Giao hàng miễn phí trong nội thành TP. HCM với đơn hàng{" "}
            <span className="bold">{">"} 200.000 đ</span>
          </span>
        </div>
        <div className="benefit-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check-icon"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span>
            Giao hàng miễn phí toàn quốc với đơn hàng{" "}
            <span className="bold">{">"} 350.000 đ</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
