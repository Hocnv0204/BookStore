import "./RecentOrdersTable.css";
import React from "react";
import InvoiceDetailModal from "../Invoice/InvoiceDetailModal";
export default function RecentOrdersTable({ orders }) {
  const recentOrders = orders.slice(0, 5);
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
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.receiverName}</td>
                  <td>{order.createdAt.split("T")[0]}</td>
                  <td>{order.totalAmount}</td>
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
    case "DELIVERED":
      badgeClass += " status-delivered";
      break;
    case "SHIPPING":
      badgeClass += " status-shipping";
      break;
    case "PENDING":
      badgeClass += " status-pending";
      break;
    case "CONFIRMED":
      badgeClass += " status-confirmed";
      break;
    case "CANCELLED":
      badgeClass += " status-canceled";
      break;
  }

  return <span className={badgeClass}>{status}</span>;
}
