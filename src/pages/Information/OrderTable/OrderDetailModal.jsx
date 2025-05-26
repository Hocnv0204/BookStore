import React, { useState, useEffect } from "react";
import "./OrderDetailModal.css";
import axios from "axios";

function ReviewModal({ bookId, bookTitle, review, onClose, onSuccess }) {
  const [rating, setRating] = useState(review ? review.rating : 5);
  const [comment, setComment] = useState(review ? review.comment : "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    review ? review.imageUrl : null
  );
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(!!review);

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
      setImagePreview(review.imageUrl || null);
      setEditing(false);
    } else {
      setRating(5);
      setComment("");
      setImagePreview(null);
      setEditing(false);
    }
  }, [review]);
  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
      setImagePreview(review.imageUrl || null);
      setEditing(false); // For existing reviews, start in view mode
    } else {
      setRating(5);
      setComment("");
      setImagePreview(null);
      setEditing(true); // For new reviews, start in edit mode to allow image upload
    }
  }, [review]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("request", JSON.stringify({ rating, comment }));
      if (imageFile) formData.append("image", imageFile);
      if (review) {
        // Sửa review
        await axios.put(
          `http://localhost:8080/users/reviews/${review.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setMessage("Cập nhật đánh giá thành công!");
      } else {
        // Thêm review mới
        await axios.post(
          `http://localhost:8080/users/reviews/${bookId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setMessage("Đánh giá thành công!");
      }
      setTimeout(() => {
        setMessage("");
        onSuccess && onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      setMessage("Có lỗi xảy ra khi gửi đánh giá.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!review) return;
    setSubmitting(true);
    setMessage("");
    try {
      await axios.delete(`http://localhost:8080/users/reviews/${review.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setMessage("Xóa đánh giá thành công!");
      setTimeout(() => {
        setMessage("");
        onSuccess && onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      setMessage("Có lỗi xảy ra khi xóa đánh giá.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <h3>{review ? "Xem/Sửa đánh giá" : `Đánh giá sách: ${bookTitle}`}</h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="star-select">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? "star active" : "star"}
                onClick={() => setRating(star)}
                style={{ cursor: "pointer", fontSize: 22 }}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            placeholder="Nội dung đánh giá"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            required
            style={{ width: "100%", margin: "10px 0" }}
            disabled={review && !editing}
          />
          {imagePreview && (
            <div style={{ marginBottom: 10 }}>
              <img
                src={imagePreview}
                alt="preview"
                style={{ maxWidth: 120, borderRadius: 6 }}
              />
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  style={{ marginLeft: 8 }}
                >
                  Xóa ảnh
                </button>
              )}
            </div>
          )}
          {editing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: 10 }}
            />
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            {review ? (
              editing ? (
                <>
                  <button
                    type="submit"
                    className="details-button"
                    disabled={submitting}
                  >
                    {submitting ? "Đang lưu..." : "Lưu"}
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setEditing(false)}
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="details-button"
                    onClick={() => setEditing(true)}
                  >
                    Sửa đánh giá
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleDelete}
                    disabled={submitting}
                  >
                    Xóa đánh giá
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={onClose}
                  >
                    Đóng
                  </button>
                </>
              )
            ) : (
              <>
                <button
                  type="submit"
                  className="details-button"
                  disabled={submitting}
                >
                  {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={onClose}
                >
                  Hủy
                </button>
              </>
            )}
          </div>
          {message && <div className="order-message">{message}</div>}
        </form>
      </div>
    </div>
  );
}

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
          `http://localhost:8080/users/reviews/${userId}`,
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
  }, [order]);

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
