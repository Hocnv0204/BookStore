import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ReviewModal.css";
function ReviewModal({
  orderId,
  bookId,
  bookTitle,
  review,
  onClose,
  onSuccess,
}) {
  const [rating, setRating] = useState(review ? review.rating : 5);
  const [comment, setComment] = useState(review ? review.comment : "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    review ? review.imageUrl : null
  );
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(!review); // Nếu có review thì view mode, không có thì edit mode
  const [showImageZoom, setShowImageZoom] = useState(false);

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
      setEditing(true); // For new reviews, start in edit mode
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

    // Log để debug
    console.log("Form submitted. Review:", !!review, "Editing:", editing);

    // Chỉ submit khi đang ở edit mode hoặc tạo review mới
    if (review && !editing) {
      console.log("Preventing form submission - review exists but not editing");
      return;
    }

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
        setEditing(false); // Quay về view mode sau khi lưu thành công
      } else {
        // Thêm review mới
        await axios.post(
          `http://localhost:8080/users/reviews/${orderId}/${bookId}`,
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

  const handleCancelEdit = () => {
    // Reset về trạng thái ban đầu khi hủy sửa
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
      setImagePreview(review.imageUrl || null);
      setImageFile(null);
    }
    setEditing(false);
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
      <div className={`review-modal ${review && !editing ? "view-mode" : ""}`}>
        <h3>
          {review
            ? editing
              ? "Sửa đánh giá"
              : "Xem đánh giá"
            : `Đánh giá sách: ${bookTitle}`}
        </h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="star-select">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? "star active" : "star"}
                onClick={() => {
                  if (!review || editing) {
                    setRating(star);
                  }
                }}
                style={{
                  cursor: !review || editing ? "pointer" : "default",
                  fontSize: 22,
                  opacity: !review || editing ? 1 : 0.6,
                }}
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
            disabled={review && !editing}
            style={{
              width: "100%",
              margin: "10px 0",
              opacity: review && !editing ? 0.6 : 1,
              cursor: review && !editing ? "default" : "text",
            }}
          />
          {imagePreview && (
            <div className="image-preview-container">
              <img
                src={imagePreview}
                alt="preview"
                className="review-image-preview"
                onClick={() => setShowImageZoom(true)}
              />
              <div className="image-actions">
                <span className="image-zoom-hint">🔍 Nhấn để phóng to</span>
                {(!review || editing) && (
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    ✕ Xóa ảnh
                  </button>
                )}
              </div>
            </div>
          )}
          {(!review || editing) && (
            <div className="file-input-container">
              <label className="file-input-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="file-input-text">
                  Chọn ảnh đánh giá
                  <span
                    style={{
                      fontSize: "0.85em",
                      opacity: 0.9,
                      fontWeight: 500,
                    }}
                  >
                    JPG, PNG, GIF - Tối đa 5MB
                  </span>
                </div>
              </label>
            </div>
          )}
          <div className="review-button-group">
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCancelEdit();
                    }}
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="details-button"
                    onClick={(e) => {
                      console.log("Edit button clicked");
                      e.preventDefault();
                      e.stopPropagation();
                      setEditing(true);
                    }}
                  >
                    Sửa đánh giá
                  </button>
                  <button
                    type="button"
                    className="cancel-button delete-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete();
                    }}
                    disabled={submitting}
                  >
                    {submitting ? "Đang xóa..." : "Xóa đánh giá"}
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onClose();
                    }}
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

        {/* Image Zoom Modal */}
        {showImageZoom && imagePreview && (
          <div
            className="image-zoom-overlay"
            onClick={() => setShowImageZoom(false)}
          >
            <div className="image-zoom-container">
              <button
                className="image-zoom-close"
                onClick={() => setShowImageZoom(false)}
              >
                ×
              </button>
              <img
                src={imagePreview}
                alt="Zoomed review"
                className="image-zoom-full"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ReviewModal;
