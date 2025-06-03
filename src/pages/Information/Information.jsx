import { useState, useEffect, useCallback } from "react";
import "./Information.css";
import OrderTable from "./OrderTable/OrderTable";
import Sidebar from "./Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ChatBot from "../../components/ChatBot/ChatBot";
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
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
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

  // Handle sorting
  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const fetchOrders = useCallback(
    async (page = 0) => {
      setLoading(true);
      try {
        let apiUrl;

        // Use different API endpoints based on activeItem (status filter)
        if (activeItem === "all") {
          // Fetch all orders
          apiUrl = `http://localhost:8080/users/orders?page=${page}&size=10&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        } else {
          // Fetch orders by specific status
          apiUrl = `http://localhost:8080/users/orders/status?status=${activeItem}&page=${page}&size=10&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }

        const res = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

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
    },
    [sortBy, sortOrder, activeItem]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (newPage) => {
    fetchOrders(newPage);
  };

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    // Reset to first page when changing status filter
    setPagination((prev) => ({
      ...prev,
      pageNumber: 0,
    }));
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
              onSort={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
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
      <ChatBot />
    </div>
  );
}

export default Information;
