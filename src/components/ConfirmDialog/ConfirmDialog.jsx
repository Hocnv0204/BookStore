import React from "react";
import Modal from "react-modal";
import "./ConfirmDialog.css"; // Tạo file CSS này để style cho modal

// Đảm bảo Modal.setAppElement đã được gọi ở đâu đó trong ứng dụng của bạn (ví dụ: index.js)
// Modal.setAppElement('#root');

const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel} // Cho phép đóng modal khi nhấn Esc hoặc click ra ngoài
      className="confirm-dialog-content"
      overlayClassName="confirm-dialog-overlay"
    >
      <div className="confirm-dialog-inner">
        <h3>Xác nhận thao tác</h3>
        <p>{message}</p>
        <div className="confirm-dialog-buttons">
          <button onClick={onCancel} className="confirm-dialog-cancel-btn">
            Hủy
          </button>
          <button onClick={onConfirm} className="confirm-dialog-confirm-btn">
            Xác nhận
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
