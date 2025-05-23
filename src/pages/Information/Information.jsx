import { useState, useEffect } from "react";
import "./Information.css";
import OrderTable from "./OrderTable/OrderTable";
import Sidebar from "./Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import InfoModal from "./InfoModal/InfoModal"; // Modal cập nhật thông tin
import ChangePasswordModal from "./InfoModal/ChangePasswordModal"; // Modal đổi mật khẩu
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Information() {
  const [activeItem, setActiveItem] = useState("all");
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState(null); // Quản lý modal nào đang mở
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 1,
    last: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchOrders = async (page = 0) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/users/orders?page=${page}&size=10&sortBy=totalAmount&sortOrder=asc`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (res.data) {
        setOrders(res.data.content);
        console.log(res.data);
        setPagination({
          pageNumber: res.data.pageNumber,
          pageSize: res.data.pageSize,
          totalElements: res.data.totalElements,
          totalPages: res.data.totalPages,
          last: res.data.last,
        });
      }
    } catch (error) {
      setOrders([]);
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePageChange = (newPage) => {
    fetchOrders(newPage);
  };

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
  };

  const handleAccountClick = (id) => {
    if (id === "update-info") {
      setModal("info");
    } else if (id === "change-password") {
      setModal("password");
    } else {
      localStorage.removeItem("token");
      navigate("/auth/signin");
    }
  };

  return (
    <div className="information">
      <Header />
      <h1 className="main-title">QUẢN LÝ ĐƠN HÀNG</h1>
      <div className="content-wrapper">
        <Sidebar
          activeItem={activeItem}
          onItemClick={handleItemClick}
          onClickAccount={handleAccountClick} // Truyền hàm này xuống Sidebar
        />
        <main className="main-content">
          {loading ? (
            <div>Đang tải đơn hàng...</div>
          ) : (
            <OrderTable
              orders={orders}
              pageNumber={pagination.pageNumber}
              pageSize={pagination.pageSize}
              totalElements={pagination.totalElements}
              totalPages={pagination.totalPages}
              last={pagination.last}
              onPageChange={handlePageChange}
              filterStatus={activeItem}
            />
          )}
        </main>
      </div>
      <Footer />

      {/* Hiển thị modal dựa trên trạng thái */}
      {modal === "info" && (
        <InfoModal
          isOpen={modal === "info"}
          onClose={() => setModal(null)}
          user={user}
          onSave={(data) => console.log("Dữ liệu mới:", data)}
        />
      )}

      {modal === "password" && (
        <ChangePasswordModal onClose={() => setModal(null)} />
      )}
    </div>
  );
}

export default Information;
