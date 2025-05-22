import React, { useState } from "react";
import "./OrderDetailModal.css";

function OrderDetailModal({ order, onClose, loading }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    receiverName: order.receiverName || "",
    deliveryAddress: order.deliveryAddress || "",
    phoneNumber: order.phoneNumber || "",
    email: order.email || "",
    note: order.note || "",
  });
  const [editMessage, setEditMessage] = useState("");

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditMessage("");
    try {
      const res = await fetch(
        `http://localhost:8080/users/orders/${order.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(editData),
        }
      );
      if (res.ok) {
        setEditMessage("Cập nhật hóa đơn thành công!");
        setTimeout(() => {
          setEditMessage("");
          setIsEditing(false);
          window.location.reload();
        }, 1200);
      } else {
        setEditMessage("Cập nhật hóa đơn thất bại!");
      }
    } catch (err) {
      setEditMessage("Có lỗi xảy ra khi cập nhật!");
    }
  };

  if (!order) return null;
  return (
    <div className="order-details-modal">
      <div className="order-details-modal-content">
        <button className="close-modal" onClick={onClose}>
          Đóng
        </button>
        <h2>Chi tiết đơn hàng #{order.id}</h2>
        {isEditing ? (
          <form className="edit-order-form" onSubmit={handleEditSubmit}>
            <div>
              <label>Người nhận:</label>
              <input
                name="receiverName"
                value={editData.receiverName}
                onChange={handleEditChange}
                required
              />
            </div>
            <div>
              <label>Địa chỉ:</label>
              <input
                name="deliveryAddress"
                value={editData.deliveryAddress}
                onChange={handleEditChange}
                required
              />
            </div>
            <div>
              <label>Số điện thoại:</label>
              <input
                name="phoneNumber"
                value={editData.phoneNumber}
                onChange={handleEditChange}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                name="email"
                value={editData.email}
                onChange={handleEditChange}
                required
              />
            </div>
            <div>
              <label>Ghi chú:</label>
              <input
                name="note"
                value={editData.note}
                onChange={handleEditChange}
              />
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              <button type="submit" className="details-button">
                Lưu
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setIsEditing(false)}
              >
                Hủy
              </button>
            </div>
            {editMessage && <div className="order-message">{editMessage}</div>}
          </form>
        ) : (
          <>
            <div>
              <b>Người nhận:</b> {order.receiverName}
            </div>
            <div>
              <b>Địa chỉ:</b> {order.deliveryAddress}
            </div>
            <div>
              <b>Số điện thoại:</b> {order.phoneNumber}
            </div>
            <div>
              <b>Email:</b> {order.email}
            </div>
            <div>
              <b>Ghi chú:</b> {order.note}
            </div>
            <div>
              <b>Trạng thái:</b> {order.status}
            </div>
            <div>
              <b>Tổng tiền:</b> {order.totalAmount?.toLocaleString("vi-VN")} đ
            </div>
            {order.status === "PENDING" && (
              <button
                className="edit-order-btn"
                onClick={() => setIsEditing(true)}
              >
                Sửa hóa đơn
              </button>
            )}
          </>
        )}
        <div style={{ margin: "16px 0" }}>
          <b>Danh sách sản phẩm:</b>
          {order.items && order.items.length > 0 ? (
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
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
            <div>Không có sản phẩm trong đơn hàng.</div>
          )}
        </div>
        {loading && <div>Đang tải chi tiết đơn hàng...</div>}
      </div>
    </div>
  );
}

export default OrderDetailModal;
