import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./InfoModal.css";

Modal.setAppElement("#root");

const InfoModal = ({ isOpen, onClose, user = {}, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
  });

  // Cập nhật lại form mỗi khi mở modal hoặc user thay đổi
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        dob: user.dob || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Tạo mảng ngày, tháng, năm cho select
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // Hàm tách ngày/tháng/năm từ dob
  const getDateParts = (dob) => {
    if (!dob) return { day: "", month: "", year: "" };
    const [year, month, day] = dob.split("-");
    return { day, month, year };
  };
  const { day, month, year } = getDateParts(formData.dob);

  // Khi chọn ngày/tháng/năm
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    let d = day || "01";
    let m = month || "01";
    let y = year || String(currentYear);
    if (name === "day") d = value.padStart(2, "0");
    if (name === "month") m = value.padStart(2, "0");
    if (name === "year") y = value;
    setFormData({ ...formData, dob: `${y}-${m}-${d}` });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.put("http://localhost:8080/users", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const existingUser = JSON.parse(localStorage.getItem("user")) || {};
      const updatedUser = {
        ...existingUser,
        fullName: formData.fullName,
        dob: formData.dob,
        gender: formData.gender,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      onSave && onSave(formData);

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-box"
      overlayClassName="modal-overlay"
    >
      <h2>Chỉnh sửa thông tin</h2>

      <label>Họ và Tên</label>
      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
      />

      <label>Ngày sinh</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <select name="day" value={day} onChange={handleDateChange}>
          <option value="">Ngày</option>
          {days.map((d) => (
            <option key={d} value={String(d).padStart(2, "0")}>
              {d}
            </option>
          ))}
        </select>
        <select name="month" value={month} onChange={handleDateChange}>
          <option value="">Tháng</option>
          {months.map((m) => (
            <option key={m} value={String(m).padStart(2, "0")}>
              {m}
            </option>
          ))}
        </select>
        <select name="year" value={year} onChange={handleDateChange}>
          <option value="">Năm</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <label>Giới tính</label>
      <select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="">-- Chọn giới tính --</option>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
        <option value="Khác">Khác</option>
      </select>

      <div className="modal-buttons">
        <button onClick={onClose}>Hủy</button>
        <button className="save-button" onClick={handleSave}>
          Lưu
        </button>
      </div>
    </Modal>
  );
};

export default InfoModal;
