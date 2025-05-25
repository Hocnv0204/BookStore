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
  "Tồn Kho",
  "Giá",
  "Ảnh Sách",
  "Tác Giả",
  "Danh Mục",
  "Nhà Xuất Bản",
  "Nhà Phân Phối",
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
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState("");

  const fetchBooks = async (searchKeyword = keyword) => {
    try {
      const params = { page, size, sortBy, sortOrder };
      let url = "http://localhost:8080/api/v1/books";
      if (searchKeyword && searchKeyword.trim() !== "") {
        params.keyword = searchKeyword.trim();
        url = `http://localhost:8080/api/v1/books/search`;
      }
      const res = await axios.get(url, {
        params,
      });
      const transformedBooks = res.data.content.map((book) => ({
        id: book.id,
        title: book.title,
        quantityStock: book.quantityStock,
        price: book.price,
        image: book.imageUrl,
        author: book.authorName,
        category: book.categoryName,
        publisher: book.publisherName,
        distributor: book.distributorName,
      }));
      setBooks(transformedBooks);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sách:", error);
    }
  };

  const handleNewBookAdded = (newBook) => {
    if (newBook && newBook.id) {
      const transformedBook = {
        id: newBook.id,
        title: newBook.title,
        quantityStock: newBook.quantityStock,
        price: newBook.price,
        image: newBook.imageUrl,
        author: newBook.authorName,
        category: newBook.categoryName,
        publisher: newBook.publisherName,
        distributor: newBook.distributorName,
      };
      setBooks((prevBooks) => [transformedBook, ...prevBooks]);
    } else {
      console.error("Dữ liệu sách mới không hợp lệ khi thêm:", newBook);
    }
  };

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  useEffect(() => {
    fetchBooks();
  }, [page, size, sortBy, sortOrder]);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchBooks(keyword);
  };

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
              <div className="book-management-search-container">
                <form
                  onSubmit={handleSearch}
                  style={{ display: "flex", gap: 8 }}
                >
                  <input
                    type="text"
                    id="searchInput"
                    placeholder="Tìm kiếm theo tên sách "
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <button type="submit" className="search-button">
                    <svg
                      class="icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
            ContentTable={books}
            HeaderTable={HeaderTable}
            type="book"
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            totalElements={totalElements}
            onSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
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
