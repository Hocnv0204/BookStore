import React from "react";
import "./Breadcrumb.css";
import { Link } from "react-router-dom";
function Breadcrumb() {
  return (
    <div className="breadcrumb-container">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">
          Trang chủ
        </Link>
        <span className="breadcrumb-separator">{">"}</span>
        <Link to="/" className="breadcrumb-link">
          Văn Sách Tiếng Việt
        </Link>
        <span className="breadcrumb-separator">{">"}</span>
        <span className="breadcrumb-current">
          Collect Book Camphong/end 2025
        </span>
      </div>
    </div>
  );
}

export default Breadcrumb;
