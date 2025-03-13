import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>Trang chủ</h1>
      <Link to="/auth">Đi đến trang Đăng nhập</Link>
    </div>
  );
}

export default HomePage;
