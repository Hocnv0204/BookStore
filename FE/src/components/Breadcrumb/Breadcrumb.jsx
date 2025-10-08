import React from "react";
import "./Breadcrumb.css";
import { Link } from "react-router-dom";

function Breadcrumb({ bookTitle, category, categoryPath }) {
  // categoryPath: mảng các category cha, mỗi phần tử {id, name}
  // Nếu không có categoryPath, fallback về category như cũ
  let categories = [];
  if (Array.isArray(categoryPath) && categoryPath.length > 0) {
    categories = categoryPath;
  } else if (category && typeof category === "object") {
    categories = [category];
  } else if (category && typeof category === "string") {
    categories = [{ name: category }];
  }

  return (
    <div className="breadcrumb-container">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">
          Trang chủ
        </Link>
        {categories.map((cat, idx) => (
          <React.Fragment key={cat.id || cat.name}>
            <span className="breadcrumb-separator">&gt;</span>
            {cat.id ? (
              <Link to={`/category/${cat.id}`} className="breadcrumb-link">
                {cat.name}
              </Link>
            ) : (
              <span className="breadcrumb-link">{cat.name}</span>
            )}
          </React.Fragment>
        ))}
        {bookTitle && (
          <>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">{bookTitle}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default Breadcrumb;
