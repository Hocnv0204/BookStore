import Table from "../Table/Table";
import "./Invoice.css";
import React from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import Sidebar from "../Sidebar/Sidebar";
import { useState, useEffect } from "react";
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

  const fetchOrders = async (pageNumber = 0) => {
    const response = await axios.get("http://localhost:8080/admin/orders", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      params: {
        page: pageNumber,
        size: size,
        sortBy: sortBy,
        sortOrder: sortOrder,
      },
    });
    setOrders(response.data.content);
    setTotalPages(response.data.totalPages);
    setTotalElements(response.data.totalElements);
  };

  // Lấy chi tiết hóa đơn từ danh sách orders
  const showInvoiceDetail = (id) => {
    const invoice = orders.find((order) => order.id === id);
    setSelectedInvoice(invoice);
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page, size, sortBy, sortOrder]);

  const tableHeaders = [
    "Mã Hóa Đơn",
    "Khách Hàng",
    "Tổng Tiền",
    "Ngày Lập",
    "Chi tiết",
  ];

  return (
    <div className="invoice">
      <Header />
      <div className="invoice-container">
        <Sidebar />
        <div className="invoice-main">
          <div className="content-header">
            <h2>Danh Sách Hóa Đơn</h2>
            <div
              className="content-actions"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div className="invoice-search-container">
                <input
                  type="text"
                  id="searchInput"
                  placeholder="Tìm kiếm theo mã hóa đơn..."
                  // onKeyUp={searchInvoice} // Nếu có hàm searchInvoice
                />
              </div>
              <div
                className="invoice-sort-container"
                style={{ display: "flex", gap: 8 }}
              >
                <select
                  onChange={(e) => setSortBy(e.target.value)}
                  value={sortBy}
                >
                  <option value="id">Sắp xếp theo mã hóa đơn</option>
                  <option value="totalAmount">Sắp xếp theo tổng tiền</option>
                  <option value="createdAt">Sắp xếp theo ngày lập</option>
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
            ContentTable={orders.map((order) => ({
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
            }))}
            HeaderTable={tableHeaders}
            type="orders"
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            totalElements={totalElements}
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
