import "./Sidebar.css";

const orderMenuItems = [
  { id: "all", label: "Tất Cả", count: 0 },
  { id: "confirmed", label: "Đã Xác Nhận", count: 0 },
  { id: "shipping", label: "Đang Giao Hàng", count: 0 },
  { id: "delivered", label: "Đã Giao Hàng", count: 0 },
  { id: "cancelled", label: "Đã Hủy Đơn", count: 0, className: "text-red-500" },
];

const accountMenuItems = [
  { id: "update-info", label: "Cập Nhật Thông Tin Tài Khoản" },
  { id: "change-password", label: "Đổi Password" },
  { id: "logout", label: "Đăng Xuất" },
];

function Sidebar({ activeItem, onItemClick, onClickAccount }) {
  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-header">QL Đơn Hàng</div>
        <ul className="sidebar-menu">
          {orderMenuItems.map((item) => (
            <li
              key={item.id}
              className={`sidebar-item ${
                activeItem === item.id ? "active" : ""
              }`}
              onClick={() => onItemClick(item.id)}
            >
              {item.label}({item.count})
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-header">QL Tài Khoản</div>
        <ul className="sidebar-menu">
          {accountMenuItems.map((item) => (
            <li
              key={item.id}
              className={`sidebar-item ${
                activeItem === item.id ? "active" : ""
              }`}
              onClick={() => onClickAccount(item.id)} // Gọi hàm từ cha
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
