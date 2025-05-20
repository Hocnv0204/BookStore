import "./RecentOrdersTable.css";

export default function RecentOrdersTable() {
  const orders = [
    {
      id: "ORD001",
      customer: "Nguyễn Văn A",
      date: "2025-05-18",
      total: "550,000đ",
      status: "Đã giao",
    },
    {
      id: "ORD002",
      customer: "Trần Thị B",
      date: "2025-05-18",
      total: "1,200,000đ",
      status: "Đang giao",
    },
    {
      id: "ORD003",
      customer: "Lê Văn C",
      date: "2025-05-17",
      total: "320,000đ",
      status: "Chờ xác nhận",
    },
    {
      id: "ORD004",
      customer: "Phạm Thị D",
      date: "2025-05-17",
      total: "780,000đ",
      status: "Đã xác nhận",
    },
    {
      id: "ORD005",
      customer: "Hoàng Văn E",
      date: "2025-05-16",
      total: "950,000đ",
      status: "Đã hủy",
    },
  ];

  return (
    <div className="orders-card">
      <div className="orders-content">
        <h2 className="orders-title">Đơn hàng gần đây</h2>
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Mã ĐH</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{order.total}</td>
                  <td>
                    <OrderStatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }) {
  let badgeClass = "status-badge";

  switch (status) {
    case "Đã giao":
      badgeClass += " status-delivered";
      break;
    case "Đang giao":
      badgeClass += " status-shipping";
      break;
    case "Chờ xác nhận":
      badgeClass += " status-pending";
      break;
    case "Đã xác nhận":
      badgeClass += " status-confirmed";
      break;
    case "Đã hủy":
      badgeClass += " status-canceled";
      break;
  }

  return <span className={badgeClass}>{status}</span>;
}
