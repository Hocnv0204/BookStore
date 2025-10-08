import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./EditPublisherModal.css";

Modal.setAppElement("#root");

const EditPublisherModal = ({ isOpen, onClose, publisher, onSave }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
  });
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (publisher) {
      setFormData({
        id: publisher.id || "",
        name: publisher.name || "",
        address: publisher.address || "",
        phoneNumber: publisher.phoneNumber || "",
        email: publisher.email || "",
      });
    }
  }, [publisher]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.id) return;
    try {
      const res = await axios.put(
        `http://localhost:8080/admin/publishers/${formData.id}`,
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
    } catch (error) {
      console.error("Lỗi khi cập nhật nhà xuất bản:", error);
      alert("Lỗi khi cập nhật nhà xuất bản");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-box"
      overlayClassName="modal-overlay"
    >
      <div className="edit-modal-content-inner">
        <h2>Chỉnh sửa nhà xuất bản</h2>
        <div className="scrollable-content">
          <form onSubmit={handleSave}>
            <label>Mã nhà xuất bản</label>
            <input type="text" name="id" value={formData.id} readOnly />
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
          <button type="submit" onClick={handleSave} className="save-button">
            Lưu
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditPublisherModal;
