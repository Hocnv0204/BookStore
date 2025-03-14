import React from "react";
import "./ProductsHeader.css";

function ProductsHeader({ title }) {
  return (
    <div className="products-header">
      <h1>{title}</h1>
      <div className="sort-container">
        <span>Sắp xếp:</span>
        <select className="sort-select">
          <option>Xem nhiều nhất</option>
          <option>Ngày xuất bản</option>
          <option>Giá tăng dần</option>
          <option>Giá giảm dần</option>
          <option>Bán chạy nhất</option>
          <option>Mới nhất</option>
        </select>
      </div>
    </div>
  );
}

export default ProductsHeader;
