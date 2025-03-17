import React from "react";
import Modal from "react-modal";
import "./AddBookModal.css";
Modal.setAppElement("#root"); // Định nghĩa phần tử gốc của ứng dụng

const AddBookModal = ({ isOpen, onClose }) => {
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
          <form>
            <label>Tên sách</label>
            <input type="text" placeholder="Nhập tên sách" />

            <label>Nhà xuất bản</label>
            <input type="text" placeholder="Nhập nhà xuất bản" />

            <label>Tác giả</label>
            <input type="text" placeholder="Nhập tác giả" />

            <label>Giá</label>
            <input type="number" placeholder="Nhập giá" />

            <label>Tồn Kho</label>
            <input type="number" placeholder="Nhập tồn kho" />

            <label>Mô tả</label>
            <textarea rows="3" placeholder="Nhập mô tả"></textarea>

            <label>Ảnh Sách</label>
            <input type="file" name="image" accept="image/*" />
          </form>
        </div>
        <div className="modal-buttons">
          <button type="button" onClick={onClose} className="cancel-btn">
            Hủy
          </button>
          <button type="submit" className="add-btn">
            Thêm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddBookModal;
