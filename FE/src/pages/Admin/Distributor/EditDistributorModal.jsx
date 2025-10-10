import { useState, useEffect } from "react";
import axios from "axios";
import "./Distributor.css";

function EditDistributorModal({ isOpen, onClose, distributor, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
  });

  useEffect(() => {
    if (distributor) {
      setFormData({
        name: distributor.name || "",
        address: distributor.address || "",
        phoneNumber: distributor.phoneNumber || "",
        email: distributor.email || "",
      });
    }
  }, [distributor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8080/api/distributors/admin/${distributor.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating distributor:", error);
      alert("Lỗi khi cập nhật nhà phân phối!");
    }
  };

  if (!isOpen || !distributor) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Sửa Nhà Phân Phối</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Tên nhà phân phối:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Địa chỉ:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Số điện thoại:</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="save-button">
              Lưu
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditDistributorModal;
