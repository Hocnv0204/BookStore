import "./Sidebar.css";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h2 className="sidebar-title">BookStore</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
        >
          Tổng quan
        </NavLink>
        <NavLink
          to="/admin/books"
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
        >
          Quản Lý Sách
        </NavLink>
        <NavLink
          to="/admin/customers"
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
        >
          Quản Lý Khách Hàng
        </NavLink>
        <NavLink
          to="/admin/invoices"
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
        >
          Quản Lý Hóa Đơn
        </NavLink>
        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
        >
          Quản Lý Danh Mục
        </NavLink>
        <NavLink
          to="/admin/publishers"
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
        >
          Quản Lý Nhà Xuất Bản
        </NavLink>
        <NavLink
          to="/admin/distributors"
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
        >
          Quản Lý Nhà Phân Phối
        </NavLink>
        <NavLink
          to="/admin/reviews"
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
        >
          Quản Lý Đánh Giá
        </NavLink>
        <NavLink
          to="/admin/coupons"
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
        >
          Quản Lý Coupon
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
