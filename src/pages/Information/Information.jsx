import { useState } from "react";
import "./Information.css";
import OrderTable from "./OrderTable/OrderTable";
import Sidebar from "./Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import InfoModal from "./InfoModal/InfoModal"; // Modal cập nhật thông tin
import ChangePasswordModal from "./InfoModal/ChangePasswordModal"; // Modal đổi mật khẩu
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Information() {
  const [activeItem, setActiveItem] = useState("all");
  const [modal, setModal] = useState(null); // Quản lý modal nào đang mở
  const navigate = useNavigate();

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
          user={{
            fullName: "Nguyễn Văn A",
            birthDate: "2000-01-01",
            phoneNumber: "0123456789",
            email: "test@example.com",
          }} // Dữ liệu mẫu
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
