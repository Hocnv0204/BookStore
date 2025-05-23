import "./Sidebar.css";
import { Link } from "react-router-dom";

function Sidebar({ activeItem, onItemClick, onClickAccount }) {
  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h2 className="sidebar-title-user">Tài khoản</h2>
      </div>
      <nav className="sidebar-nav">
        <div
          className={`sidebar-link${activeItem === "all" ? " active" : ""}`}
          onClick={() => onItemClick("all")}
        >
          Tất cả đơn hàng
        </div>
        <div
          className={`sidebar-link${activeItem === "CONFIRM" ? " active" : ""}`}
          onClick={() => onItemClick("CONFIRM")}
        >
          Đã xác nhận
        </div>
        <div
          className={`sidebar-link${
            activeItem === "DELIVERED" ? " active" : ""
          }`}
          onClick={() => onItemClick("DELIVERED")}
        >
          Đã giao hàng
        </div>
        <div
          className={`sidebar-link${
            activeItem === "CANCELLED" ? " active" : ""
          }`}
          onClick={() => onItemClick("CANCELLED")}
        >
          Đã hủy đơn
        </div>
      </nav>
      <div className="sidebar-account-actions">
        <div
          className="sidebar-link"
          onClick={() => onClickAccount("update-info")}
        >
          Cập nhật thông tin
        </div>
        <div
          className="sidebar-link"
          onClick={() => onClickAccount("change-password")}
        >
          Đổi mật khẩu
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
