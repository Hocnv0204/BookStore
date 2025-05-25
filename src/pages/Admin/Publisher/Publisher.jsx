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

  useEffect(() => {
    fetchPublishers();
  }, [page, size, sortBy, sortOrder]);

  const fetchPublishers = async (searchKeyword = keyword) => {
    try {
      const params = { page, size, sortBy, sortOrder };
      let url = "http://localhost:8080/api/v1/publishers";
      if (searchKeyword && searchKeyword.trim() !== "") {
        params.keyword = searchKeyword.trim();
        url = `http://localhost:8080/api/v1/publishers/search`;
      }
      const response = await axios.get(url, { params });
      setPublishers(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching publishers:", error);
    }
  };

  const handleAddPublisher = (newPublisher) => {
    setPublishers([newPublisher, ...publishers]);
  };

  const handleEditPublisher = (updatedPublisher) => {
    setPublishers(
      publishers.map((pub) =>
        pub.id === updatedPublisher.id ? updatedPublisher : pub
      )
    );
  };

  const handleDeletePublisher = async (publisherId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhà xuất bản này?")) {
      try {
        await axios.delete(
          `http://localhost:8080/admin/publishers/${publisherId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setPublishers(publishers.filter((pub) => pub.id !== publisherId));
        alert("Xóa nhà xuất bản thành công!");
      } catch (error) {
        console.error("Error deleting publisher:", error);
        alert("Lỗi khi xóa nhà xuất bản!");
      }
    }
  };

  const handleEdit = (publisher) => {
    setSelectedPublisher(publisher);
    setIsEditModalOpen(true);
  };

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchPublishers(keyword);
  };

  const tableHeaders = [
    "Mã NXB",
    "Tên NXB",
    "Địa chỉ",
    "Số điện thoại",
    "Email",
    "",
  ];

  const transformedPublishers = publishers.map((publisher) => ({
    ...publisher,
    // actions: (
    //   <div className="more-actions">
    //     <button onClick={() => handleEdit(publisher)} className="edit-button">
    //       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    //         <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
    //       </svg>
    //       Sửa
    //     </button>
    //     <button
    //       onClick={() => handleDeletePublisher(publisher.id)}
    //       className="del-button"
    //     >
    //       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    //         <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
    //       </svg>
    //       Xóa
    //     </button>
    //   </div>
    // ),
  }));

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
      <AddPublisherModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddPublisher}
      />
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
