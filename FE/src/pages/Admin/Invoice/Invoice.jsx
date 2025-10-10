import Table from "../Table/Table";
import "./Invoice.css";
import React, { useState, useEffect } from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import InvoiceDetailModal from "./InvoiceDetailModal";

function Invoice() {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [page, size, sortBy, sortOrder]);

  const fetchOrders = async (searchKeyword = keyword) => {
    try {
      const params = { page, size, sortBy, sortOrder };
      let url = "http://localhost:8080/api/orders/admin";
      if (searchKeyword && searchKeyword.trim() !== "") {
        params.keyword = searchKeyword.trim();
        url = `http://localhost:8080/api/orders/admin/search`;
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        params,
      });
      console.log("Fetched orders:", response.data);
      setOrders(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
      setTotalElements(response.data.data.totalElements);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Lấy chi tiết hóa đơn từ danh sách orders
  const showInvoiceDetail = (id) => {
    const invoice = orders.find((order) => order.id === id);
    setSelectedInvoice(invoice);
  };

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchOrders(keyword);
  };

  const tableHeaders = [
    "Mã Hóa Đơn",
    "Khách Hàng",
    "Tổng Tiền",
    "Ngày Lập",
    "Chi tiết",
  ];

  // Transform orders data to include action buttons
  const transformedOrders = orders.map((order) => ({
    maHoaDon: order.id,
    khachHang: order.receiverName,
    tongTien: order.totalAmount,
    ngayLap: new Date(order.createdAt).toLocaleDateString("vi-VN"),
    chiTiet: (
      <button
        className="details-button"
        onClick={() => showInvoiceDetail(order.id)}
      >
        Xem
      </button>
    ),
  }));

  return (
    <div className="invoice">
      <Header />
      <div className="invoice-container">
        <Sidebar />
        <div className="invoice-main">
          <div className="content-header">
            <h2>Danh Sách Hóa Đơn</h2>
            <div className="content-actions">
              <div className="invoice-search-container">
                <form
                  onSubmit={handleSearch}
                  style={{ display: "flex", gap: 8 }}
                >
                  <input
                    type="text"
                    id="searchInput"
                    placeholder="Tìm kiếm theo tên khách hàng"
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
            ContentTable={transformedOrders}
            HeaderTable={tableHeaders}
            type="orders"
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            totalElements={totalElements}
            onSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        </div>
      </div>
      <Footer />

      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}

export default Invoice;
