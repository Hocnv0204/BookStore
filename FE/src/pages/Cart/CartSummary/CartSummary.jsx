import React from "react";
import "./CartSummary.css";
import { Link } from "react-router-dom";

const CartSummary = ({ selectedItems, onOrder }) => {
  const calculateTotal = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const total = calculateTotal(selectedItems);

  return (
    <div className="cart-summary">
      <div className="summary-row">
        <span>Tạm tính</span>
        <span className="total-amount">{total.toLocaleString()} đ</span>
      </div>
      <div className="cart-actions">
        <button className="button-order" onClick={onOrder}>
          ĐẶT HÀNG
        </button>
        <Link to="/">
          <button className="button-continue">CHỌN THÊM SẢN PHẨM</button>
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;
