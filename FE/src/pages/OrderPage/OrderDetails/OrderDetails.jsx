import "./OrderDetails.css";
import axios from "axios";
import { useState, useEffect } from "react";

function OrderDetails({ selectedItems, total }) {
  return (
    <div className="order-details">
      <h2 className="order-details-title">Chi tiết đơn hàng</h2>
      <div className="order-details-content">
        <div className="product-list">
          <h3>Sản phẩm:</h3>
          <table className="order-items">
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item) => (
                <tr key={item.bookId}>
                  <td>{item.bookTitle}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="order-summary">
          <div className="summary-row total">
            <span>Thanh toán: {total.toLocaleString("vi-VN")} đ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
