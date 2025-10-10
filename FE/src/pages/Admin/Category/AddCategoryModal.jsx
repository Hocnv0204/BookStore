import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

import "./AddCategoryModal.css";

Modal.setAppElement("#root");

const AddCategoryModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [image, setImage] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const categoryData = new FormData();
      categoryData.append(
        "category",
        new Blob([JSON.stringify(formData)], { type: "application/json" })
      );
      if (image) {
        categoryData.append("image", image);
      }
      const res = await axios.post(
        "http://localhost:8080/api/categories/admin",
        categoryData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      onSave(res.data);
      console.log(res.data);
      onClose();
      setFormData({
        name: "",
      });
      setImage(null);
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      alert("Lỗi khi thêm danh mục");
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
        <h2>Thêm danh mục</h2>
        <div className="scrollable-content">
          <form onSubmit={handleSubmit}>
            <label>Tên danh mục</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label>Ảnh danh mục</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
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

export default AddCategoryModal;
