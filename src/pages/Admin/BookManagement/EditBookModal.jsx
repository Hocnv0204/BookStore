import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./EditBookModal.css";

Modal.setAppElement("#root"); // Tránh lỗi accessibility

const EditBookModal = ({ isOpen, onClose, book, onSave }) => {
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [formData, setFormData] = useState({
    id: book.id || "",
    title: book.title || "",
    publisherId: book.publisherId || "",
    authorName: book.authorName || "",
    price: book.price || "",
    quantityStock: book.quantityStock || "",
    description: book.description || "",
    categoryId: book.categoryId || "",
    introduction: book.introduction || "",
    distributorId: book.distributorId || "",
  });
  console.log(book);
  const [image, setImage] = useState(null); // Để xử lý ảnh mới
  const accessToken = localStorage.getItem("accessToken"); // Lấy accessToken

  // Cập nhật formData khi prop 'book' thay đổi (khi mở modal với sách khác)
  useEffect(() => {
    setFormData({
      id: book.id || "",
      title: book.title || "",
      publisherId: book.publisherId || "",
      authorName: book.authorName || "",
      price: book.price || "",
      quantityStock: book.quantityStock || "",
      description: book.description || "",
      categoryId: book.categoryId || "",
      introduction: book.introduction || "",
      distributorId: book.distributorId || "",
    });
    setImage(null); // Reset ảnh khi mở modal mới
  }, [book]);

  // Fetch categories và publishers khi modal mở
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/categories");
        setCategories(res.data.result.content); // Nếu backend trả về result → content
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    const fetchDistributors = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/v1/distributors"
        );
        setDistributors(res.data.content);
      } catch (error) {
        console.error("Lỗi khi lấy nhà phân phối:", error);
      }
    };
    const fetchPublishers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/publishers");
        setPublishers(res.data.content);
      } catch (error) {
        console.error("Lỗi khi lấy publisher:", error);
      }
    };

    if (isOpen) {
      fetchCategories();
      fetchPublishers();
      fetchDistributors();
    }
  }, [isOpen]);

  // Xử lý khi người dùng nhập thông tin
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Xử lý khi người dùng chọn ảnh
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Xử lý khi nhấn "Lưu"
  const handleSave = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi submit mặc định của form

    const payload = {
      title: formData.title,
      quantityStock: parseInt(formData.quantityStock),
      price: parseFloat(formData.price),
      authorName: formData.authorName,
      categoryId: parseInt(formData.categoryId),
      description: formData.description,
      publisherId: parseInt(formData.publisherId),
      distributorId: parseInt(formData.distributorId),
      introduction: formData.introduction,
    };

    try {
      const bookData = new FormData();
      bookData.append(
        "book",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );
      if (image) {
        bookData.append("image", image);
      } else {
      }

      // Gửi yêu cầu PUT để cập nhật sách
      const res = await axios.put(
        `http://localhost:8080/admin/books/${formData.id}`, // Sử dụng ID trong URL
        bookData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      onSave(res.data); // Truyền dữ liệu sách đã cập nhật về component cha
      onClose(); // Đóng modal
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi cập nhật sách:", error);
      alert("Lỗi khi cập nhật sách");
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
        {" "}
        {/* Đổi tên class cho rõ ràng */}
        <h2>Chỉnh sửa sách</h2>
        <div className="scrollable-content">
          {" "}
          {/* Thêm scrollable-content như AddBookModal */}
          <form onSubmit={handleSave}>
            {" "}
            {/* Đổi onSubmit để gọi handleSave */}
            <label>Mã Sách</label>
            <input type="text" name="id" value={formData.id} readOnly />{" "}
            {/* ID thường là read-only */}
            <label>Tên sách</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
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
            <label>Tác giả</label>
            <input
              type="text"
              name="authorName" // Đổi tên để khớp
              value={formData.authorName}
              onChange={handleChange}
              required
            />
            <label>Giá</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <label>Tồn kho</label>
            <input
              type="number"
              name="quantityStock" // Đổi tên để khớp
              value={formData.quantityStock}
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
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            <label>Giới thiệu</label>
            <textarea
              name="introduction"
              rows="3"
              value={formData.introduction}
              onChange={handleChange}
            ></textarea>
            <label>Ảnh Sách (Để trống nếu không thay đổi)</label>
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

export default EditBookModal;
