import React from "react";
import "./Breadcrumb.css";
import { Link } from "react-router-dom";
function Breadcrumb({ bookTitle, category }) {
  return (
    <div className="breadcrumb-container">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">
          Trang chủ
        </Link>
        <span className="breadcrumb-separator">{">"}</span>
        <Link to={`/category/${category.id}`} className="breadcrumb-link">
          {category.name}
        </Link>
        {bookTitle && (
          <div className="breadcrumb-product">
            <span className="breadcrumb-separator">{">"}</span>
            <span className="breadcrumb-current">{bookTitle}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Breadcrumb;
