import React, { useState } from "react";
import "./ChangePasswordModal.css";

const ChangePasswordModal = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    console.log("Đã thay đổi mật khẩu!");
    onClose(); // Đóng modal sau khi đổi mật khẩu
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Thay đổi mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Mật khẩu cũ:
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Mật khẩu mới:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Xác nhận mật khẩu mới:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>
              Hủy
            </button>
            <button type="submit">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
