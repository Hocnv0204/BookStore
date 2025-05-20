import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <div className="sidebar-admin-header">
          <h1 className="sidebar-title">Trang Quản Lý</h1>
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <svg
              className="nav-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Tổng quan
          </NavLink>
          <NavLink
            to="/admin/book-management"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <svg
              className="nav-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Quản Lý Sách
          </NavLink>
          <NavLink
            to="/customer"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <svg
              className="nav-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
            Quản Lý Khách Hàng
          </NavLink>
          <NavLink
            to="/invoice"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <svg
              className="nav-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Quản Lý Hóa Đơn
          </NavLink>
          <NavLink
            to="/category"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <svg
              className="nav-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Quản Lý Danh Mục
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
