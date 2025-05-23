import React, { useState } from "react";
import "./ChangePasswordModal.css";
import axios from "axios";

const ChangePasswordModal = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu mới không khớp!");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.put(
        "http://localhost:8080/users/change-password",
        {
          currentPassword: oldPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (res.data && res.data.code === 0) {
        setMessage("Đổi mật khẩu thành công!");
        setTimeout(() => {
          setMessage("");
          onClose();
        }, 1200);
      } else {
        setMessage(res.data.message || "Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Đổi mật khẩu thất bại! Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
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
          {message && (
            <div
              className={`modal-message${
                message.toLowerCase().includes("thành công") ? "" : " error"
              }`}
            >
              {message}
            </div>
          )}
          <div className="modal-buttons">
            <button type="button" onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
