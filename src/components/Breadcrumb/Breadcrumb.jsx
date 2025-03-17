import React from "react";
import "./Breadcrumb.css";
import { Link } from "react-router-dom";
import { categories } from "../../data/category";
function Breadcrumb({ categoryName, bookTitle }) {
  const category = categories.find((item) => item.name === categoryName);
  const categoryTitle = category.title;
  return (
    <div className="breadcrumb-container">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">
          Trang chủ
        </Link>
        <span className="breadcrumb-separator">{">"}</span>
        <Link to={`/category/${categoryTitle}`} className="breadcrumb-link">
          {categoryName}
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
