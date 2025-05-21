import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

import "./EditCategoryModal.css";

Modal.setAppElement("#root");

const EditCategoryModal = ({ isOpen, onClose, category, onSave }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
  });
  const [image, setImage] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (category) {
      setFormData({
        id: category.id || "",
        name: category.name || "",
      });
      setImage(null);
    }
  }, [category]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.id) return;
    const payload = {
      name: formData.name,
    };
    try {
      const categoryData = new FormData();
      categoryData.append(
        "category",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );
      if (image) {
        categoryData.append("image", image);
      }
      const res = await axios.put(
        `http://localhost:8080/admin/categories/${formData.id}`,
        categoryData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      onSave(res.data);
      console.log(res);
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      alert("Lỗi khi cập nhật danh mục");
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
        <h2>Chỉnh sửa danh mục</h2>
        <div className="scrollable-content">
          <form onSubmit={handleSave}>
            <label>Mã danh mục</label>
            <input type="text" name="id" value={formData.id} readOnly />
            <label>Tên danh mục</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label>Ảnh danh mục (Để trống nếu không thay đổi)</label>
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
          <button type="submit" onClick={handleSave} className="save-button">
            Lưu
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditCategoryModal;
