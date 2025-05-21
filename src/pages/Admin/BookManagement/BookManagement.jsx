import { useState, useEffect } from "react";
import axios from "axios";
import Table from "../Table/Table";
import AddBookModal from "./AddBookModal";
import Header from "../../../components/Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../../../components/Footer/Footer";
import "./BookManagement.css";

const HeaderTable = [
  "Mã Sách",
  "Tên Sách",
  "Mô Tả",
  "Tồn Kho",
  "Giá",
  "Ảnh Sách",
  "Tác Giả",
  "Danh Mục",
  "Nhà Xuất Bản",
  "Giới Thiệu",
  "",
];

function BookManagement() {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/books", {
        params: { page, size, sortBy, sortOrder },
      });
      setBooks(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sách:", error);
    }
  };
  const handleNewBookAdded = (newBook) => {
    console.log(
      "New book received in BookManagement handleNewBookAdded:",
      newBook
    );
    if (newBook && newBook.id) {
      setBooks((prevBooks) => [newBook, ...prevBooks]);
    } else {
      console.error("Dữ liệu sách mới không hợp lệ khi thêm:", newBook);
    }
  };
  useEffect(() => {
    fetchBooks();
  }, [page, size, sortBy, sortOrder]);

  return (
    <div className="book-management">
      <Header />
      <div className="book-management-container">
        <Sidebar />
        <div className="book-management-main">
          <div className="content-header">
            <h2>Danh Sách Sách</h2>
            <div className="content-actions">
              <div className="add-container">
                <button className="add-btn" onClick={() => setShowModal(true)}>
                  <i className="fas fa-plus"></i>
                  Thêm sách
                </button>
              </div>
              <div class="book-management-search-container">
                <input
                  type="text"
                  id="searchInput"
                  placeholder="Tìm kiếm theo mã sách..."
                  onkeyup="searchBook()"
                />
              </div>
              {/* Dropdown sort */}
              <div className="book-management-sort-container">
                <select
                  onChange={(e) => setSortBy(e.target.value)}
                  value={sortBy}
                >
                  <option value="title">Sắp xếp theo tên</option>
                  <option value="price">Sắp xếp theo giá</option>
                  <option value="quantityStock">Sắp xếp theo tồn kho</option>
                  <option value="id">Sắp xếp theo mã sách</option>
                </select>

                <select
                  onChange={(e) => setSortOrder(e.target.value)}
                  value={sortOrder}
                >
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </select>
              </div>
            </div>
          </div>

          <Table
            ContentTable={books}
            HeaderTable={HeaderTable}
            type="book"
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />

          {showModal && (
            <AddBookModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onSave={handleNewBookAdded}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BookManagement;
