import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CheckoutForm.css";
import axios from "axios";

function CheckoutForm() {
  const [formData, setFormData] = useState({
    receiverName: "",
    phoneNumber: "",
    email: "",
    deliveryAddress: "",
    note: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      // Gửi dữ liệu đúng structure cho API
      const res = await axios.post(
        "http://localhost:8080/users/orders/from-cart",
        {
          receiverName: formData.receiverName,
          deliveryAddress: formData.deliveryAddress,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          note: formData.note,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data && res.data.id) {
        setSuccessMessage("Đặt hàng thành công!");
        setFormData({
          receiverName: "",
          phoneNumber: "",
          email: "",
          deliveryAddress: "",
          note: "",
        });
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setErrorMessage("Đặt hàng thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h1 className="checkout-title">ĐẶT HÀNG</h1>
      <div className="form-container">
        <h2 className="form-section-title">THÔNG TIN ĐƠN HÀNG</h2>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="receiverName" className="form-label">
              Họ và tên <span className="required">(*)</span>
            </label>
            <input
              type="text"
              id="receiverName"
              name="receiverName"
              className="form-input"
              value={formData.receiverName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">
              Điện thoại <span className="required">(*)</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className="form-input"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email <span className="required">(*)</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Email để nhận thông báo đơn hàng"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="deliveryAddress" className="form-label">
              Địa chỉ nhận <span className="required">(*)</span>
            </label>
            <input
              type="text"
              id="deliveryAddress"
              name="deliveryAddress"
              className="form-input"
              value={formData.deliveryAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="note" className="form-label">
              Ghi chú
            </label>
            <textarea
              id="note"
              name="note"
              className="form-textarea"
              placeholder="Ghi chú về đơn hàng"
              value={formData.note}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Đang đặt hàng..." : "ĐẶT HÀNG"}
        </button>
      </div>
    </form>
  );
}

export default CheckoutForm;
