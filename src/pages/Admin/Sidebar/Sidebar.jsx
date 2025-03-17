import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useLocation } from "react-router-dom";
function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar-admin">
      <div className="sidebar-admin-header">
        <h2 className="sidebar-admin-title">Trang Quản Lý</h2>
      </div>
      <nav className="sidebar-admin-nav">
        <NavLink
          to="/admin"
          className={`nav-item ${
            location.pathname === "/admin" ? "active" : ""
          }`}
        >
          <span>Quản Lý Sách</span>
        </NavLink>
        <NavLink
          to="/customer"
          className={`nav-item ${
            location.pathname === "/customer" ? "active" : ""
          }`}
        >
          <span>Quản Lý Khách Hàng</span>
        </NavLink>
        <NavLink
          to="/invoice"
          className={`nav-item ${
            location.pathname === "/invoice" ? "active" : ""
          }`}
        >
          <span>Quản Lý Hóa Đơn</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
