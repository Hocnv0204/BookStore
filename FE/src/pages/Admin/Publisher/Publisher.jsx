import { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../../../components/Header/Header";
import Table from "../Table/Table";
import Footer from "../../../components/Footer/Footer";
import AddPublisherModal from "./AddPublisherModal";
import EditPublisherModal from "./EditPublisherModal";
import axios from "axios";
import "./Publisher.css";

function Publisher() {
  const [publishers, setPublishers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const accessToken = localStorage.getItem("accessToken");

  // 🧭 Lấy danh sách NXB mỗi khi thay đổi sort, page, size
  useEffect(() => {
    fetchPublishers();
  }, [page, size, sortBy, sortOrder]);

  // 🧩 Hàm lấy dữ liệu NXB từ API
  const fetchPublishers = async (searchKeyword = keyword) => {
    try {
      const params = { page, size, sortBy, sortOrder };
      let url = "http://localhost:8080/api/publishers";

      if (searchKeyword.trim()) {
        params.keyword = searchKeyword.trim();
        url = "http://localhost:8080/api/publishers/search";
      }

      const response = await axios.get(url, { params });

      setPublishers(response.data?.content || []);
      setTotalPages(response.data?.totalPages || 1);
      setTotalElements(response.data?.totalElements || 0);
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách NXB:", error);
      setPublishers([]); // tránh lỗi .map()
    }
  };

  // ➕ Thêm NXB mới
  const handleAddPublisher = (newPublisher) => {
    if (newPublisher) {
      setPublishers((prev) => [newPublisher, ...prev]);
    }
  };

  // ✏️ Cập nhật NXB
  const handleEditPublisher = (updatedPublisher) => {
    if (updatedPublisher?.id) {
      setPublishers((prev) =>
        prev.map((pub) =>
          pub.id === updatedPublisher.id ? updatedPublisher : pub
        )
      );
    }
  };

  // ❌ Xóa NXB
  const handleDeletePublisher = async (publisherId) => {
    if (!publisherId) return;
    if (window.confirm("Bạn có chắc chắn muốn xóa nhà xuất bản này?")) {
      try {
        await axios.delete(
          `http://localhost:8080/api/publishers/admin/${publisherId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setPublishers((prev) => prev.filter((pub) => pub.id !== publisherId));
        alert("✅ Xóa nhà xuất bản thành công!");
      } catch (error) {
        console.error("❌ Lỗi khi xóa nhà xuất bản:", error);
        alert("Lỗi khi xóa nhà xuất bản!");
      }
    }
  };

  // ✏️ Mở modal sửa
  const handleEdit = (publisher) => {
    setSelectedPublisher(publisher);
    setIsEditModalOpen(true);
  };

  // 🔄 Sắp xếp
  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  // 🔍 Tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchPublishers(keyword);
  };

  // 🧾 Tiêu đề bảng
  const tableHeaders = [
    "Mã NXB",
    "Tên NXB",
    "Địa chỉ",
    "Số điện thoại",
    "Email",
    "",
  ];

  // 🔧 Dữ liệu hiển thị
  const transformedPublishers = Array.isArray(publishers)
    ? publishers.map((publisher) => ({
        ...publisher,
      }))
    : [];

  return (
    <div className="publisher">
      <Header />
      <div className="publisher-container">
        <Sidebar />
        <div className="publisher-main">
          <div className="content-header">
            <h2>Danh Sách Nhà Xuất Bản</h2>

            <div className="content-actions">
              <div className="add-container">
                <button
                  className="add-publisher-btn"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <i className="fas fa-plus"></i>
                  Thêm nhà xuất bản
                </button>
              </div>

              <div className="publisher-search-container">
                <form
                  onSubmit={handleSearch}
                  style={{ display: "flex", gap: 8 }}
                >
                  <input
                    id="searchInput"
                    type="text"
                    placeholder="Tìm kiếm theo tên nhà xuất bản"
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

          <div className="publisher-table-wrapper">
            <Table
              ContentTable={transformedPublishers}
              HeaderTable={tableHeaders}
              type="publisher"
              onEdit={handleEdit}
              onDelete={handleDeletePublisher}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={size}
              currentPage={page}
              onPageChange={(newPage) => setPage(newPage)}
              onSort={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal thêm */}
      <AddPublisherModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddPublisher}
      />

      {/* Modal sửa */}
      <EditPublisherModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        publisher={selectedPublisher}
        onSave={handleEditPublisher}
      />
    </div>
  );
}

export default Publisher;
