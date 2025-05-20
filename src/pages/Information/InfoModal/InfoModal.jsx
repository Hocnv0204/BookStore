import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./InfoModal.css";

Modal.setAppElement("#root");

const InfoModal = ({ isOpen, onClose, user = {}, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
  });

  // Cập nhật lại form mỗi khi mở modal hoặc user thay đổi
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        dob: user.dob || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.put("http://localhost:8080/users", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const existingUser = JSON.parse(localStorage.getItem("user")) || {};
      const updatedUser = {
        ...existingUser,
        fullName: formData.fullName,
        dob: formData.dob,
        gender: formData.gender,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      onSave && onSave(formData);

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    }
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

      <label>Ngày sinh</label>
      <input
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
      />

      <label>Giới tính</label>
      <select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="">-- Chọn giới tính --</option>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
        <option value="Khác">Khác</option>
      </select>

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
