import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import { useState } from "react"; // Import useState để quản lý trạng thái phân trang
import "./BookSection.css";

function BookSection({ books }) {
  // Số sản phẩm mỗi trang (4 sản phẩm x 3 hàng = 12 sản phẩm)
  const itemsPerPage = 8;

  // State để theo dõi trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);

  // Tính tổng số trang
  const totalPages = Math.ceil(books.length / itemsPerPage);

  // Tính chỉ số bắt đầu và kết thúc của sách trên trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Lấy danh sách sách cho trang hiện tại
  const currentBooks = books.slice(startIndex, endIndex);

  // Hàm chuyển trang
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu trang khi chuyển
  };

  // Hàm tạo các nút phân trang
  const renderPagination = () => {
    const pageButtons = [];

    // Nút Previous
    pageButtons.push(
      <button
        key="prev"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
    );

    // Các nút số trang
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    // Nút Next
    pageButtons.push(
      <button
        key="next"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    );

    return <div className="pagination">{pageButtons}</div>;
  };

  return (
    <div>
      {/* Hiển thị sách trên trang hiện tại */}
      <div className="book-grid">
        {currentBooks.map((book) => (
          <Link
            to={`/product/${book.id}`} // Đường dẫn động đến trang chi tiết sản phẩm
            key={book.id}
            className="book-card"
          >
            <div className="book-image-container">
              <img
                src={book.image || "/placeholder.svg"}
                alt={book.title}
                className="book-image"
              />
              {book.discount > 0 && (
                <div className="discount-badge">-{book.discount}%</div>
              )}
            </div>

            <h3 className="book-title">{book.title}</h3>

            {book.author && <p className="book-author">{book.author}</p>}

            <div className="book-price">
              <span className="current-price">
                {book.price.toLocaleString()}đ
              </span>
              {book.originalPrice > book.price && (
                <span className="original-price">
                  {book.originalPrice.toLocaleString()}đ
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Hiển thị phân trang nếu có nhiều hơn 1 trang */}
      {totalPages > 1 && renderPagination()}
    </div>
  );
}

export default BookSection;
