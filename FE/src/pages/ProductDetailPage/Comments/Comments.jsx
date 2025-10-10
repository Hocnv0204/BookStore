import React, { useEffect, useState, useRef } from "react";
import "./Comments.css";
import Pagination from "../../../components/Pagination/Pagination";
import axios from "axios";
import { useParams } from "react-router-dom";
const currentUserId = Number(localStorage.getItem("user.id")); // hoặc lấy từ context/auth
const isLoggedIn = Boolean(localStorage.getItem("user"));

function Comments() {
  const { id: bookId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterRating, setFilterRating] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [myReview, setMyReview] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef();
  const [reviewError, setReviewError] = useState("");

  // Fetch reviews
  const fetchReviews = async () => {
    if (!bookId) return;
    const params = {
      page,
      size,
      sortBy,
      sortOrder,
    };
    if (filterRating > 0) params.rating = filterRating;
    const res = await axios.get(`http://localhost:8080/api/reviews/${bookId}`, {
      params,
    });
    setReviews(res.data.data.content);
    setTotalPages(res.data.data.totalPages);
    setTotalElements(res.data.data.totalElements);
    // Tính trung bình
    if (res.data.data.content.length > 0) {
      const avg =
        res.data.data.content.reduce((sum, r) => sum + r.rating, 0) /
        res.data.data.content.length;
      setAverageRating(avg);
    } else {
      setAverageRating(0);
    }
    // Tìm review của user hiện tại
    const mine = res.data.data.content.find((r) => r.userId === currentUserId);
    if (mine) {
      setMyReview(mine);
      setComment(mine.comment);
      setRating(mine.rating);
      setImagePreview(mine.imageUrl || null);
      setEditing(false);
    } else {
      setMyReview(null);
      setComment("");
      setRating(5);
      setImagePreview(null);
      setEditing(false);
    }
  };

  useEffect(() => {
    if (!bookId) return;
    fetchReviews();
  }, [page, size, sortBy, sortOrder, filterRating, bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setReviewError(""); // reset lỗi trước khi gửi
    const formData = new FormData();
    formData.append("request", JSON.stringify({ rating, comment }));
    if (imageFile) formData.append("image", imageFile);
    try {
      if (myReview && editing) {
        await axios.put(
          `http://localhost:8080/users/reviews/${myReview.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          }
        );
      } else if (!myReview) {
        await axios.post(
          `http://localhost:8080/users/reviews/${bookId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          }
        );
      }
      setEditing(false);
      setImageFile(null);
      setImagePreview(null);
      fetchReviews();
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setReviewError("Bạn cần mua sách này mới được đánh giá.");
      } else {
        setReviewError("Có lỗi xảy ra khi gửi đánh giá.");
      }
    }
  };

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

  // Xử lý click sửa
  const handleEdit = () => {
    setEditing(true);
    setComment(myReview.comment);
    setRating(myReview.rating);
    setImagePreview(myReview.imageUrl || null);
    setImageFile(null);
  };

  // Xử lý hủy sửa
  const handleCancelEdit = () => {
    setEditing(false);
    setComment(myReview.comment);
    setRating(myReview.rating);
    setImagePreview(myReview.imageUrl || null);
    setImageFile(null);
  };

  // Tính phân bố số sao
  const starStats = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return { star, count };
  });
  const total = reviews.length;

  // Filter reviews ở FE
  const filteredReviews =
    filterRating > 0
      ? reviews.filter((r) => r.rating === filterRating)
      : reviews;

  // Pagination trên filteredReviews
  const pagedReviews = filteredReviews.slice(page * size, (page + 1) * size);
  const filteredTotalPages = Math.ceil(filteredReviews.length / size) || 1;
  const filteredTotalElements = filteredReviews.length;

  return (
    <div className="comments-section">
      <div className="average-rating">
        <span>Đánh giá trung bình: </span>
        <span style={{ color: "#FFD700", fontWeight: "bold" }}>
          {averageRating.toFixed(1)} / 5 ★
        </span>
      </div>
      {/* Filter by star bar */}
      <div className="star-filter-bar">
        {starStats.map(({ star, count }) => (
          <div
            key={star}
            className={`star-filter-item${
              filterRating === star ? " active" : ""
            }`}
            onClick={() => {
              setFilterRating(star);
              setPage(0);
            }}
          >
            <span className="star-label">{star} sao</span>
            <div className="star-bar">
              <div
                className="star-bar-fill"
                style={{ width: total ? `${(count / total) * 100}%` : "0%" }}
              />
            </div>
            <span className="star-percent">
              {total ? Math.round((count / total) * 100) : 0}%
            </span>
            <span className="star-count">({count})</span>
          </div>
        ))}
        {filterRating > 0 && (
          <button
            className="clear-star-filter"
            onClick={() => {
              setFilterRating(0);
              setPage(0);
            }}
          >
            Bỏ lọc
          </button>
        )}
      </div>
      <div className="review-toolbar">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Mới nhất</option>
          <option value="rating">Số sao</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">Giảm dần</option>
          <option value="asc">Tăng dần</option>
        </select>
      </div>
      {/* Nếu chưa đăng nhập thì hiển thị thông báo, ngược lại hiển thị form đánh giá */}
      {!isLoggedIn ? (
        <div
          className="login-required-message"
          style={{
            padding: "18px",
            background: "#fffbe6",
            border: "1px solid #ffe58f",
            borderRadius: 8,
            marginBottom: 18,
            color: "#ad6800",
            fontSize: 16,
          }}
        >
          Chỉ có thành viên mới có thể viết nhận xét. Vui lòng{" "}
          <a
            href="/auth/signin"
            style={{ color: "#008503", textDecoration: "underline" }}
          >
            đăng nhập
          </a>{" "}
          hoặc{" "}
          <a
            href="/auth/signup"
            style={{ color: "#008503", textDecoration: "underline" }}
          >
            đăng ký
          </a>
          .
        </div>
      ) : (
        <form
          className="comment-form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="avatar">
            <img
              src="https://nano-ceramic.vn/wp-content/uploads/2024/12/300-hinh-anh-dai-dien-dep-cho-facebook-tiktok-zalo-79.jpg"
              alt="Avatar"
            />
          </div>
          <div className="comment-input-container">
            <textarea
              placeholder="Hãy cho chúng tôi biết cảm nghĩ của bạn"
              className="comment-input"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              required
            />
            <div className="comment-toolbar">
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
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <button
                type="button"
                className="toolbar-button"
                onClick={() => fileInputRef.current.click()}
              >
                Thêm ảnh
              </button>
              {imagePreview && (
                <div className="image-preview">
                  <img
                    src={imagePreview}
                    alt="preview"
                    style={{ maxWidth: 100, borderRadius: 6 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    X
                  </button>
                </div>
              )}
              <div style={{ flex: 1 }} />
              {myReview && !editing ? (
                <button
                  type="button"
                  className="toolbar-button"
                  onClick={handleEdit}
                >
                  Sửa đánh giá
                </button>
              ) : editing ? (
                <>
                  <button type="submit" className="toolbar-button">
                    Lưu
                  </button>
                  <button
                    type="button"
                    className="toolbar-button"
                    onClick={handleCancelEdit}
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <button type="submit" className="toolbar-button">
                  Gửi đánh giá
                </button>
              )}
            </div>
          </div>
          {reviewError && (
            <div
              style={{
                color: "#e53935",
                background: "#fff1f0",
                border: "1px solid #ffa39e",
                borderRadius: 6,
                padding: 10,
                margin: "10px 0",
              }}
            >
              {reviewError}
            </div>
          )}
        </form>
      )}
      <div className="comments-list">
        {filteredReviews.length === 0 ? (
          <div style={{ padding: 16, textAlign: "center" }}>
            Chưa có đánh giá nào.
          </div>
        ) : (
          pagedReviews.map((r) => (
            <div className="review-item" key={r.id}>
              <div className="review-header">
                <span className="review-username">{r.username}</span>
                <span className="review-rating">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </span>
                <span className="review-date">
                  {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>
              {r.imageUrl && (
                <img src={r.imageUrl} alt="review" className="review-image" />
              )}
              <div className="review-comment">{r.comment}</div>
              {r.userId === currentUserId && !editing && (
                <button className="toolbar-button" onClick={handleEdit}>
                  Sửa
                </button>
              )}
            </div>
          ))
        )}
      </div>
      <Pagination
        pageNumber={page}
        pageSize={size}
        totalElements={filteredTotalElements}
        totalPages={filteredTotalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

export default Comments;
