import { useState, useEffect } from "react";
import "./Information.css";
import OrderTable from "./OrderTable/OrderTable";
import Sidebar from "./Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import InfoModal from "./InfoModal/InfoModal"; // Modal cập nhật thông tin
import ChangePasswordModal from "./InfoModal/ChangePasswordModal"; // Modal đổi mật khẩu
import { useNavigate } from "react-router-dom";
function Information() {
  const [activeItem, setActiveItem] = useState("all");
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState(null); // Quản lý modal nào đang mở
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
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
          <OrderTable orders={[]} />
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
