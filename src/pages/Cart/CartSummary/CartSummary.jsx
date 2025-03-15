import React from "react";
import "./CartSummary.css";
import { Link } from "react-router-dom";
const CartSummary = ({ total }) => {
  return (
    <div className="cart-summary">
      <div className="summary-row">
        <span>Tạm tính</span>
        <span className="total-amount">{total.toLocaleString()} đ</span>
      </div>
      <div className="cart-actions">
        <Link to="/order">
          <button className="button-order">ĐẶT HÀNG</button>
        </Link>
        <button className="button-continue">CHỌN THÊM SẢN PHẨM</button>
      </div>
    </div>
  );
};

export default CartSummary;
