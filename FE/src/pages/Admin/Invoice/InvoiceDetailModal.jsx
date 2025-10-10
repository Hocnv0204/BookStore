import React, { useState } from "react";
import axios from "axios";
import "./InvoiceDetailModal.css";

const STATUS_LABELS = {
  PENDING: "Chờ xác nhận",
  CONFIRM: "Đã xác nhận",
  DELIVERED: "Đã giao hàng",
  CANCELLED: "Đã hủy",
};

function InvoiceDetailModal({ invoice, onClose }) {
  const [currentStatus, setCurrentStatus] = useState(invoice.status);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const handleStatusUpdate = async (nextStatus) => {
    setUpdating(true);
    setError("");
    try {
      await axios.put(
        `http://localhost:8080/api/orders/admin/${invoice.id}/status`,
        {},
        {
          params: { status: nextStatus },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setCurrentStatus(nextStatus);
    } catch (err) {
      setError("Cập nhật trạng thái thất bại!");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusButtonClass = (status) => {
    switch (status) {
      case "CONFIRM":
        return "status-btn status-confirm";
      case "DELIVERED":
        return "status-btn status-delivered";
      default:
        return "status-btn";
    }
  };

  if (!invoice) return null;
  return (
    <div className="invoice-details-modal">
      <div className="invoice-details-modal-content">
        <button className="close-modal" onClick={onClose}>
          Đóng
        </button>
        <h2>Chi tiết hóa đơn #{invoice.id}</h2>
        <div>
          <b>Người nhận:</b> {invoice.receiverName}
        </div>
        <div>
          <b>Địa chỉ:</b> {invoice.deliveryAddress}
        </div>
        <div>
          <b>Số điện thoại:</b> {invoice.phoneNumber}
        </div>
        <div>
          <b>Email:</b> {invoice.email}
        </div>
        <div>
          <b>Ngày lập:</b>{" "}
          {new Date(invoice.createdAt).toLocaleDateString("vi-VN")}
        </div>
        <div>
          <b>Phương thức thanh toán:</b> {invoice.paymentMethod}
        </div>
        <div>
          <b>Ghi chú:</b> {invoice.note}
        </div>
        <div
          style={{
            margin: "12px 0",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <b>Trạng thái:</b>
          <span
            className={`status-badge status-badge-${currentStatus.toLowerCase()}`}
          >
            {STATUS_LABELS[currentStatus] || currentStatus}
          </span>
          {currentStatus === "PENDING" && (
            <>
              <button
                className={getStatusButtonClass("CONFIRM")}
                onClick={() => handleStatusUpdate("CONFIRM")}
                disabled={updating}
              >
                Xác nhận
                {updating && " ..."}
              </button>
              <button
                className={"status-btn status-cancelled"}
                onClick={() => handleStatusUpdate("CANCELLED")}
                disabled={updating}
              >
                Hủy đơn
                {updating && " ..."}
              </button>
            </>
          )}
          {currentStatus === "CONFIRM" && (
            <>
              <button
                className={getStatusButtonClass("DELIVERED")}
                onClick={() => handleStatusUpdate("DELIVERED")}
                disabled={updating}
              >
                Đã giao hàng
                {updating && " ..."}
              </button>
              <button
                className={"status-btn status-cancelled"}
                onClick={() => handleStatusUpdate("CANCELLED")}
                disabled={updating}
              >
                Giao hàng thất bại
                {updating && " ..."}
              </button>
            </>
          )}
          {error && (
            <span style={{ color: "red", marginLeft: 8 }}>{error}</span>
          )}
        </div>
        <div>
          <b>Tổng tiền:</b> {invoice.totalAmount?.toLocaleString("vi-VN")} đ
        </div>
        <div style={{ margin: "16px 0" }}>
          <b>Danh sách sản phẩm:</b>
          {invoice.items && invoice.items.length > 0 ? (
            <table className="invoice-items-table">
              <thead>
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.bookTitle}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price?.toLocaleString("vi-VN")} đ</td>
                    <td>{item.subtotal?.toLocaleString("vi-VN")} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>Không có sản phẩm trong hóa đơn.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetailModal;
