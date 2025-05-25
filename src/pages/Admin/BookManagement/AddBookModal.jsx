import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

import "./AddBookModal.css";

Modal.setAppElement("#root");

const AddBookModal = ({ isOpen, onClose, onSave }) => {
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    publisherId: 1,
    authorName: "",
    price: "",
    quantityStock: "",
    description: "",
    categoryId: 1,
    introduction: "",
    distributorId: 1,
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
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/categories");
        setCategories(res.data.result.content);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    const fetchPublishers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/publishers");
        setPublishers(res.data.content);
        console.log(res);
      } catch (error) {
        console.error("Lỗi khi lấy publisher:", error);
      }
    };
    const fetchDistributors = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/v1/distributors"
        );
        setDistributors(res.data.content);
        console.log(res);
      } catch (error) {
        console.error("Lỗi khi lấy nhà phân phối:", error);
      }
    };
    if (isOpen) {
      fetchCategories();
      fetchPublishers();
      fetchDistributors();
    }
  }, [isOpen]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      quantityStock: parseInt(formData.quantityStock),
      price: parseFloat(formData.price),
      authorName: formData.authorName,
      categoryId: parseInt(formData.categoryId),
      description: formData.description,
      distributorId: parseInt(formData.distributorId),
      publisherId: parseInt(formData.publisherId),
      introduction: formData.introduction,
    };
    try {
      const bookData = new FormData();
      bookData.append(
        "book",
        new Blob(
          [JSON.stringify(payload)], // ✅ JSON.stringify mặc định tạo JSON một dòng
          { type: "application/json" }
        )
      ); // ✅ dùng Blob thay vì string
      if (image) {
        bookData.append("image", image);
      }

      const res = await axios.post(
        "http://localhost:8080/admin/books",
        bookData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      onSave(res.data);
      onClose();
    } catch (error) {
      console.error("Lỗi khi thêm sách:", error);
      alert("Lỗi khi thêm sách");
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
        <h2>Thêm sách</h2>
        <div className="scrollable-content">
          <form onSubmit={handleSubmit}>
            <label>Tên sách</label>
            <input type="text" name="title" onChange={handleChange} required />
            <label>Nhà phân phối</label>
            <select
              name="distributorId"
              value={formData.distributorId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn nhà phân phối --</option>
              {distributors.map((distributor) => (
                <option key={distributor.id} value={distributor.id}>
                  {distributor.name}
                </option>
              ))}
            </select>
            <label>Nhà xuất bản</label>
            <select
              name="publisherId"
              value={formData.publisherId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn nhà xuất bản --</option>
              {publishers.map((pub) => (
                <option key={pub.id} value={pub.id}>
                  {pub.name}
                </option>
              ))}
            </select>

            <label>Tác giả</label>
            <input
              type="text"
              name="authorName"
              onChange={handleChange}
              required
            />

            <label>Giá</label>
            <input
              type="number"
              name="price"
              onChange={handleChange}
              required
            />

            <label>Tồn kho</label>
            <input
              type="number"
              name="quantityStock"
              onChange={handleChange}
              required
            />

            <label>Danh mục</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <label>Mô tả</label>
            <textarea
              name="description"
              rows="3"
              onChange={handleChange}
            ></textarea>
            <label>Giới thiệu</label>
            <textarea
              name="introduction"
              rows="3"
              onChange={handleChange}
            ></textarea>
            <label>Ảnh Sách</label>
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

export default AddBookModal;
