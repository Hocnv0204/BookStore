import { useState, useEffect } from "react";
import axios from "axios";
import Table from "../Table/Table";
import Header from "../../../components/Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../../../components/Footer/Footer";
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog";
import "./ReviewManagement.css";

const HeaderTable = [
  "Mã Đánh Giá",
  "Người Dùng",
  "Mã Sách",
  "Tên Sách",
  "Đánh Giá",
  "Bình Luận",
  "Hình Ảnh",
  "Ngày Tạo",
  "Ngày Cập Nhật",
  "",
];

function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState(null);

  const fetchReviews = async (searchKeyword = keyword) => {
    try {
      const params = { page, size, sortBy, sortOrder };
      let url = "http://localhost:8080/admin/reviews";

      // Nếu có từ khóa tìm kiếm, sử dụng API search
      if (searchKeyword && searchKeyword.trim() !== "") {
        url = "http://localhost:8080/admin/reviews/search";
        params.keyword = searchKeyword.trim();
      }

      const res = await axios.get(url, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (res.data && res.data.result) {
        const transformedReviews = res.data.result.content.map((review) => ({
          id: review.id,
          username: review.username,
          bookId: review.bookId,
          bookTitle: review.bookTitle,
          rating: review.rating,
          comment: review.comment,
          imageUrl: review.imageUrl,
          createdAt: new Date(review.createdAt).toLocaleString(),
          updatedAt: new Date(review.updatedAt).toLocaleString(),
        }));
        setReviews(transformedReviews);
        setTotalPages(res.data.result.totalPages);
        setTotalElements(res.data.result.totalElements);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đánh giá:", error);
    }
  };

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handleDeleteClick = (reviewId) => {
    setReviewIdToDelete(reviewId);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewIdToDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:8080/users/reviews/${reviewIdToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== reviewIdToDelete)
        );
        alert("Xóa đánh giá thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            alert("Bạn không có quyền xóa đánh giá. Vui lòng đăng nhập lại.");
            break;
          case 403:
            alert("Bạn không có đủ quyền để thực hiện thao tác này.");
            break;
          case 404:
            alert("Không tìm thấy đánh giá để xóa.");
            break;
          default:
            alert("Đã xảy ra lỗi khi xóa đánh giá.");
        }
      }
    } finally {
      setIsConfirmDialogOpen(false);
      setReviewIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmDialogOpen(false);
    setReviewIdToDelete(null);
  };

  useEffect(() => {
    fetchReviews();
  }, [page, size, sortBy, sortOrder]);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0); // Reset về trang đầu tiên khi tìm kiếm
    fetchReviews(keyword);
  };

  return (
    <div className="review-management">
      <Header />
      <div className="review-management-container">
        <Sidebar />
        <div className="review-management-main">
          <div className="content-header">
            <h2>Danh Sách Đánh Giá</h2>
            <div className="content-actions">
              <div className="review-management-search-container">
                <form
                  onSubmit={handleSearch}
                  style={{ display: "flex", gap: 8 }}
                >
                  <input
                    type="text"
                    id="searchInput"
                    placeholder="Tìm kiếm theo tên sách"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <button type="submit" className="search-button">
                    <svg
                      className="icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>

          <Table
            ContentTable={reviews}
            HeaderTable={HeaderTable}
            type="review"
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            totalElements={totalElements}
            onSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onDelete={handleDeleteClick}
          />

          <ConfirmDialog
            isOpen={isConfirmDialogOpen}
            message={`Bạn có chắc chắn muốn xóa đánh giá có ID: ${
              reviewIdToDelete || ""
            } không? Thao tác này không thể hoàn tác!`}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ReviewManagement;
