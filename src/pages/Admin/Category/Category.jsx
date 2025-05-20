import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../../../components/Header/Header";
import Table from "../Table/Table";
import Footer from "../../../components/Footer/Footer";

function Category() {
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const invoices = [
    {
      maHoaDon: "235689784512",
      tongTien: 480000,
      ngayLap: "15/5/2021",
      tinhTrang: "Đã Giao Hàng",
    },
    {
      maHoaDon: "235689784513",
      tongTien: 320000,
      ngayLap: "16/5/2021",
      tinhTrang: "Chờ Xác Nhận",
    },
    {
      maHoaDon: "235689784514",
      tongTien: 150000,
      ngayLap: "17/5/2021",
      tinhTrang: "Đang Vận Chuyển",
    },
    {
      maHoaDon: "235689784515",
      tongTien: 275000,
      ngayLap: "18/5/2021",
      tinhTrang: "Đã Hủy",
    },
    {
      maHoaDon: "235689784516",
      tongTien: 510000,
      ngayLap: "19/5/2021",
      tinhTrang: "Đã Giao Hàng",
    },
    {
      maHoaDon: "235689784517",
      tongTien: 400000,
      ngayLap: "20/5/2021",
      tinhTrang: "Chờ Xác Nhận",
    },
    {
      maHoaDon: "235689784518",
      tongTien: 125000,
      ngayLap: "21/5/2021",
      tinhTrang: "Đang Vận Chuyển",
    },
    {
      maHoaDon: "235689784519",
      tongTien: 220000,
      ngayLap: "22/5/2021",
      tinhTrang: "Đã Giao Hàng",
    },
    {
      maHoaDon: "235689784520",
      tongTien: 350000,
      ngayLap: "23/5/2021",
      tinhTrang: "Chờ Xác Nhận",
    },
    {
      maHoaDon: "235689784521",
      tongTien: 290000,
      ngayLap: "24/5/2021",
      tinhTrang: "Đã Hủy",
    },
  ];
  const tableHeaders = [
    "Mã Danh Mục",
    "Tên Danh Mục",
    "Ngày Tạo",
    "Ngày Cập Nhật",
    "Số Lượng Sách",
  ];
  return (
    <div className="invoice">
      <Header />
      <div className="invoice-container">
        <Sidebar />
        <div className="invoice-main">
          <div className="content-header">
            <h2>Danh Sách Hóa Đơn</h2>
            <div className="content-actions">
              <div class="sort-container">
                <span>Sắp xếp theo:</span>
                <select class="sort-select">
                  <option>Mã Hóa Đơn</option>
                  <option>Tổng Tiền Tăng Dần</option>
                  <option>Tổng Tiền Giảm Dần</option>
                  <option>Ngày Lập Mới Nhất</option>
                  <option>Ngày Lập Cũ Nhất</option>
                </select>
              </div>
              <div class="customer-search-container">
                <input
                  type="text"
                  id="searchInput"
                  placeholder="Tìm kiếm theo mã hóa đơn..."
                  onkeyup="searchCustomer()"
                />
              </div>
            </div>
          </div>
          <Table
            ContentTable={invoices}
            HeaderTable={tableHeaders}
            type="invoice"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default Category;
