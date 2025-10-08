import React, { useState } from "react";
import "./ProductDetails.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProductDetails({ book }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleAddToCart = async (redirectToCart = false) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8080/users/cart/items",
        {
          bookId: book.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.data.code === 200) {
        setMessage({
          text: "Đã thêm sản phẩm vào giỏ hàng!",
          type: "success",
        });
        if (redirectToCart) {
          setTimeout(() => {
            navigate("/cart");
          }, 500);
        }
      } else {
        setMessage({
          text: "Không thể thêm sản phẩm vào giỏ hàng",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi thêm vào giỏ hàng",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
    }
  };

  return (
    <div className="product-details">
      <h1 className="product-title">{book.title}</h1>

      <div className="product-author">
        <span className="author-label">Tác giả:</span>
        <span className="author-name">{book.authorName}</span>
      </div>
      <div className="product-description">{book.description}</div>
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
        <span className="status-text">
          Tình trạng: {book.quantityStock > 0 ? "Còn hàng" : "Hết hàng"}
        </span>
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
        {book.price.toLocaleString()}
        <sup>đ</sup>
      </div>

      <div className="buy-button-container">
        <button
          className="buy-button"
          onClick={() => handleAddToCart(true)}
          disabled={isLoading || book.quantityStock === 0}
        >
          Mua ngay
        </button>
        <div className="add-to-cart">
          <button
            className="add-to-cart-button"
            onClick={() => handleAddToCart(false)}
            disabled={isLoading || book.quantityStock === 0}
          >
            {isLoading ? "Đang thêm..." : "Thêm vào giỏ hàng"}
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

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
