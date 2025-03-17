import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./EditBookModal.css";

Modal.setAppElement("#root"); // Tránh lỗi accessibility

const EditBookModal = ({ isOpen, onClose, book, onSave }) => {
  // Tạo state để lưu thông tin nhập vào
  const [formData, setFormData] = useState({
    title: book.title || "",
    author: book.author || "",
    price: book.price || "",
    description: book.description || "",
    quantity: book.quantity || "",
    publisher: book.publisher || "",
    id: book.id || "",
  });
  useEffect(() => {
    setFormData({
      title: book.title || "",
      author: book.author || "",
      price: book.price || "",
      description: book.description || "",
      quantity: book.quantity || "",
      publisher: book.publisher || "",
      id: book.id || "",
    });
  }, [book]);

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
      <div className="edit-modal-content">
        <h2>Chỉnh sửa thông tin</h2>

        <label>Mã Sách</label>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
        />

        <label>Tên Sách</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <label> Nhà Xuất Bản</label>
        <input
          type="text"
          name="publisher"
          value={formData.publisher}
          onChange={handleChange}
        />

        <label>Tác giả</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
        />

        <label>Giá</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
        <label>Mô Tả</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <label>Tồn Kho</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
        />
      </div>
      <div className="modal-buttons">
        <button onClick={onClose}>Hủy</button>
        <button className="save-button" onClick={handleSave}>
          Lưu
        </button>
      </div>
    </Modal>
  );
};

export default EditBookModal;
