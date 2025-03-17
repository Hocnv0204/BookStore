import Table from "../Table/Table";
import "./Customer.css";
import React from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import Sidebar from "../Sidebar/Sidebar";
// import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import { useState } from "react";

const customers = [
  {
    customerId: "CUST001",
    fullName: "Nguyễn Văn Hùng",
    username: "hungnv",
    password: "hung@2023",
    address: "45 Nguyễn Huệ, Quận 1, TP.HCM",
    phone: "0912345678",
  },
  {
    customerId: "CUST002",
    fullName: "Trần Thị Mai",
    username: "maitt",
    password: "mai12345",
    address: "12 Lê Lợi, Quận 3, TP.HCM",
    phone: "0987654321",
  },
  {
    customerId: "CUST003",
    fullName: "Phạm Quốc Anh",
    username: "anhpq",
    password: "quocanh99",
    address: "78 Trần Phú, Nha Trang",
    phone: "0935123456",
  },
  {
    customerId: "CUST004",
    fullName: "Lê Thị Hồng Nhung",
    username: "nhunglth",
    password: "nhung#2023",
    address: "23 Pasteur, Đà Nẵng",
    phone: "0909123456",
  },
  {
    customerId: "CUST005",
    fullName: "Hoàng Minh Tuấn",
    username: "tuanhm",
    password: "tuan45678",
    address: "56 Hùng Vương, Hà Nội",
    phone: "0978123456",
  },
  {
    customerId: "CUST006",
    fullName: "Đỗ Thị Lan",
    username: "landt",
    password: "lanpass123",
    address: "89 Lý Thường Kiệt, Huế",
    phone: "0945123456",
  },
  {
    customerId: "CUST007",
    fullName: "Vũ Đình Khôi",
    username: "khoivd",
    password: "khoi@abc",
    address: "34 Nguyễn Trãi, Thanh Hóa",
    phone: "0923123456",
  },
  {
    customerId: "CUST008",
    fullName: "Bùi Thị Thanh Thủy",
    username: "thuybtt",
    password: "thuy789",
    address: "67 Phạm Ngũ Lão, Cần Thơ",
    phone: "0967123456",
  },
];

const tableHeaders = [
  "Mã Khách Hàng",
  "Họ Tên",
  "Username",
  "Password",
  "Địa Chỉ",
  "SDT",
];
function Customer() {
  return (
    <div className="customer">
      <Header />
      <div className="customer-container">
        <Sidebar />
        <div className="customer-main">
          <div className="content-header">
            <h2>Danh Sách Khách Hàng</h2>
            <div className="content-actions">
              {/* <div className="sort-container">
                <button className="sort-btn">
                  <i className="fas fa-sort-amount-down"></i>
                  Sắp xếp theo
                </button>
              </div> */}
              <div class="customer-search-container">
                <input
                  type="text"
                  id="searchInput"
                  placeholder="Tìm kiếm theo mã khách hàng..."
                  onkeyup="searchCustomer()"
                />
              </div>
            </div>
          </div>
          <Table
            ContentTable={customers}
            HeaderTable={tableHeaders}
            type="customer"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Customer;
