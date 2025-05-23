import Table from "../Table/Table";
import "./Customer.css";
import React from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import Sidebar from "../Sidebar/Sidebar";
// import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import { useState, useEffect } from "react";
import axios from "axios";

function Customer() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:8080/admin/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      params: {
        page,
        size,
        sortBy,
        sortDirection,
        search,
      },
    });
    setCustomers(
      Array.isArray(response.data.result.content)
        ? response.data.result.content
        : []
    );
    console.log(response.data.result.content);
    setTotalPages(response.data.result.totalPages);
    setTotalElements(response.data.result.totalElements);
  };
  useEffect(() => {
    fetchUsers();
  }, [page, size, sortBy, sortDirection, search]);
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
                <input
                  type="text"
                  id="searchInput"
                  placeholder="Tìm kiếm theo tên, username hoặc email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="customer-sort-container">
                <select
                  onChange={(e) => setSortBy(e.target.value)}
                  value={sortBy}
                >
                  <option value="id">Sắp xếp theo mã khách hàng</option>
                  <option value="fullName">Sắp xếp theo tên</option>
                  <option value="username">Sắp xếp theo username</option>
                  <option value="email">Sắp xếp theo email</option>
                </select>
                <select
                  onChange={(e) => setSortDirection(e.target.value)}
                  value={sortDirection}
                >
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </select>
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
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Customer;
