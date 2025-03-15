import React, { useState } from "react";
import Modal from "react-modal";
import "./InfoModal.css";
Modal.setAppElement("#root"); // Tránh lỗi accessibility

const InfoModal = ({ isOpen, onClose, user = {}, onSave }) => {
  // Tạo state để lưu thông tin nhập vào
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    birthDate: user.birthDate || "",
    phoneNumber: user.phoneNumber || "",
    email: user.email || "",
  });

  // Xử lý khi người dùng nhập thông tin
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý khi nhấn "Lưu"
  const handleSave = () => {
    onSave(formData); // Trả dữ liệu về component cha
    onClose(); // Đóng modal
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-box"
      overlayClassName="modal-overlay"
    >
      <h2>Chỉnh sửa thông tin</h2>

      <label>Họ và Tên</label>
      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
      />

      <label>Ngày tháng năm sinh</label>
      <input
        type="date"
        name="birthDate"
        value={formData.birthDate}
        onChange={handleChange}
      />

      <label>Số điện thoại</label>
      <input
        type="text"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
      />

      <label>Địa chỉ Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <div className="modal-buttons">
        <button onClick={onClose}>Hủy</button>
        <button className="save-button" onClick={handleSave}>
          Lưu
        </button>
      </div>
    </Modal>
  );
};

export default InfoModal;
