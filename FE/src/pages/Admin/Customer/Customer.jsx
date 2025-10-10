import Table from "../Table/Table";
import "./Customer.css";
import React, { useState, useEffect } from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import Sidebar from "../Sidebar/Sidebar";
// import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import axios from "axios";

function Customer() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [keyword, setKeyword] = useState("");
  const [customers, setCustomers] = useState([]);

  const fetchUsers = async (searchKeyword = keyword) => {
    const params = { page, size, sortBy, sortOrder };
    let url = "http://localhost:8080/api/users/admin";
    if (searchKeyword && searchKeyword.trim() !== "") {
      params.keyword = searchKeyword.trim();
      url = "http://localhost:8080/api/users/admin/search";
    }
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      params,
    });
    setCustomers(
      Array.isArray(response.data.data.content)
        ? response.data.data.content
        : []
    );
    console.log(response.data.data.content);
    setTotalPages(response.data.data.totalPages);
    setTotalElements(response.data.data.totalElements);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, size, sortBy, sortOrder]);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers(keyword);
  };

  // Xử lý sort khi click header
  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  return (
    <div className="customer">
      <Header />
      <div className="customer-container">
        <Sidebar />
        <div className="customer-main">
          <div className="content-header">
            <h2>Danh Sách Khách Hàng</h2>
            <div className="content-actions">
              <div className="customer-search-container">
                <form
                  onSubmit={handleSearch}
                  style={{ display: "flex", gap: 8 }}
                >
                  <input
                    type="text"
                    id="searchInput"
                    placeholder="Tìm kiếm theo tên người dùng"
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
            ContentTable={customers
              .filter((c) => c.username !== "admin")
              .map((c) => ({
                maKhachHang: c.id,
                hoTen: c.fullName,
                username: c.username,
                email: c.email,
                gioiTinh: c.gender || "",
              }))}
            HeaderTable={[
              "Mã Khách Hàng",
              "Họ Tên",
              "Username",
              "Email",
              "Giới Tính",
            ]}
            type="customer"
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            totalElements={totalElements}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Customer;
