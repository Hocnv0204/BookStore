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
          to="/admin/book-management"
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
        >
          Quản Lý Sách
        </NavLink>
        <NavLink
          to="/customer"
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
        >
          Quản Lý Khách Hàng
        </NavLink>
        <NavLink
          to="/invoice"
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
        >
          Quản Lý Hóa Đơn
        </NavLink>
        <NavLink
          to="/category"
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
        >
          Quản Lý Danh Mục
        </NavLink>
        <NavLink
          to="/publisher"
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
        >
          Quản Lý Nhà Xuất Bản
        </NavLink>
        <NavLink
          to="/distributor"
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
        >
          Quản Lý Nhà Phân Phối
        </NavLink>
        <NavLink
          to="/admin/review-management"
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
        >
          Quản Lý Đánh Giá
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
