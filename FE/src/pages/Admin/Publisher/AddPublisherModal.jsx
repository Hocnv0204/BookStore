import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./AddPublisherModal.css";

Modal.setAppElement("#root");

const AddPublisherModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
  });
  const accessToken = localStorage.getItem("accessToken");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/publishers/admin",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      onSave(res.data);
      onClose();
      setFormData({
        name: "",
        address: "",
        phoneNumber: "",
        email: "",
      });
    } catch (error) {
      console.error("Lỗi khi thêm nhà xuất bản:", error);
      alert("Lỗi khi thêm nhà xuất bản");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content-inner">
        <h2>Thêm nhà xuất bản</h2>
        <div className="scrollable-content">
          <form onSubmit={handleSubmit}>
            <label>Tên nhà xuất bản</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label>Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </form>
        </div>
        <div className="modal-buttons">
          <button type="button" onClick={onClose} className="cancel-btn">
            Hủy
          </button>
          <button type="submit" onClick={handleSubmit} className="add-btn">
            Thêm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddPublisherModal;
