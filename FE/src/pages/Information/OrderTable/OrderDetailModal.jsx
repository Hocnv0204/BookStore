import React, { useState, useEffect } from "react";
import "./OrderDetailModal.css";
import axios from "axios";
import ReviewModal from "../ReviewModal/ReviewModal";
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
  const [reviewingBook, setReviewingBook] = useState(null);
  const [userReviews, setUserReviews] = useState({});
  const userObj = JSON.parse(localStorage.getItem("user"));
  const userId = userObj.id;

  useEffect(() => {
    // Fetch tất cả review của user cho các bookId trong order
    const fetchUserReviews = async () => {
      if (!order || !order.items) return;
      const bookIds = order.items.map((item) => item.bookId);
      try {
        const res = await axios.get(
          `http://localhost:8080/users/reviews/orders/${order.id}`,
          {
            params: { size: 1000 },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        console.log(res);
        console.log(userId);
        // API trả về mảng review, map về { bookId: review }
        const reviewMap = {};
        if (
          res.data &&
          res.data.result &&
          Array.isArray(res.data.result.content)
        ) {
          res.data.result.content.forEach((r) => {
            if (bookIds.includes(r.bookId)) {
              reviewMap[r.bookId] = r;
            }
          });
        }
        setUserReviews(reviewMap);
      } catch (err) {
        setUserReviews({});
      }
    };
    fetchUserReviews();
  }, [order, userId]);

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
              <b>Ngày đặt hàng:</b>{" "}
              {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </div>
            <div>
              <b>Phương thức thanh toán:</b> {order.paymentMethod}
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
                  <th>Đánh giá sách</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => {
                  const review = userReviews[item.bookId];
                  return (
                    <tr key={item.id}>
                      <td>{item.bookTitle}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price?.toLocaleString("vi-VN")} đ</td>
                      <td>{item.subtotal?.toLocaleString("vi-VN")} đ</td>
                      <td>
                        {review ? (
                          <button
                            className="details-button"
                            onClick={() =>
                              setReviewingBook({
                                bookId: item.bookId,
                                bookTitle: item.bookTitle,
                                review,
                              })
                            }
                          >
                            Xem đánh giá
                          </button>
                        ) : order.status === "DELIVERED" ? (
                          <button
                            className="details-button"
                            onClick={() =>
                              setReviewingBook({
                                bookId: item.bookId,
                                bookTitle: item.bookTitle,
                                review: null,
                              })
                            }
                          >
                            Đánh giá
                          </button>
                        ) : (
                          <span style={{ color: "#aaa" }}>
                            Chỉ đánh giá khi đã giao
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div>Không có sản phẩm trong đơn hàng.</div>
          )}
        </div>
        {reviewingBook && (
          <ReviewModal
            orderId={order.id}
            bookId={reviewingBook.bookId}
            bookTitle={reviewingBook.bookTitle}
            review={reviewingBook.review}
            onClose={() => setReviewingBook(null)}
            onSuccess={() => {
              // Sau khi sửa/xóa/thêm review, reload lại danh sách review
              const fetchUserReviews = async () => {
                if (!order || !order.items) return;
                const bookIds = order.items.map((item) => item.bookId);
                try {
                  const res = await axios.get(
                    `http://localhost:8080/users/reviews/${userId}`,
                    {
                      params: { size: 1000 },
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "accessToken"
                        )}`,
                      },
                    }
                  );
                  const reviewMap = {};
                  if (
                    res.data &&
                    res.data.result &&
                    Array.isArray(res.data.result.content)
                  ) {
                    res.data.result.content.forEach((r) => {
                      if (bookIds.includes(r.bookId)) {
                        reviewMap[r.bookId] = r;
                      }
                    });
                  }
                  setUserReviews(reviewMap);
                } catch (err) {
                  setUserReviews({});
                }
              };
              fetchUserReviews();
            }}
          />
        )}
        {loading && <div>Đang tải chi tiết đơn hàng...</div>}
      </div>
    </div>
  );
}

export default OrderDetailModal;
