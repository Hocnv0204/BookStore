import "./Sidebar.css";

function Sidebar({ activeItem, onItemClick, onClickAccount }) {
  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h2 className="sidebar-title-user">BookStore</h2>
      </div>
      <nav className="sidebar-nav">
        <div
          className={`sidebar-link${activeItem === "all" ? " active" : ""}`}
          onClick={() => {
            onItemClick("all");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Tất cả đơn hàng
        </div>
        <div
          className={`sidebar-link${activeItem === "PENDING" ? " active" : ""}`}
          onClick={() => {
            onItemClick("PENDING");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Chờ xác nhận
        </div>
        <div
          className={`sidebar-link${activeItem === "CONFIRM" ? " active" : ""}`}
          onClick={() => {
            onItemClick("CONFIRM");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Đã xác nhận
        </div>
        <div
          className={`sidebar-link${
            activeItem === "DELIVERED" ? " active" : ""
          }`}
          onClick={() => {
            onItemClick("DELIVERED");
            window.scrollTo(0, 0);
          }}
        >
          Đã giao hàng
        </div>
        <div
          className={`sidebar-link${
            activeItem === "CANCELLED" ? " active" : ""
          }`}
          onClick={() => {
            onItemClick("CANCELLED");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
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
