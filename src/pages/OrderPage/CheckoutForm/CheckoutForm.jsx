import { Link } from "react-router-dom";
import { useState } from "react";
import "./CheckoutForm.css";

function CheckoutForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    packaging: "",
    paymentMethod: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h1 className="checkout-title">ĐẶT HÀNG</h1>
      <div className="form-container">
        <h2 className="form-section-title">THÔNG TIN ĐƠN HÀNG</h2>

        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Họ và tên <span className="required">(*)</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-input"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Điện thoại <span className="required">(*)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-input"
              value={formData.phone}
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
            <label htmlFor="address" className="form-label">
              Địa chỉ nhận <span className="required">(*)</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="form-input"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="province" className="form-label">
                Tỉnh/Thành <span className="required">(*)</span>
              </label>
              <select
                id="province"
                name="province"
                className="form-select"
                value={formData.province}
                onChange={handleChange}
                required
              >
                <option value="">Chọn tỉnh thành</option>
                <option value="hanoi">Hà Nội</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="district" className="form-label">
                Quận/Huyện <span className="required">(*)</span>
              </label>
              <select
                id="district"
                name="district"
                className="form-select"
                value={formData.district}
                onChange={handleChange}
                required
              >
                <option value="">Chọn quận huyện</option>
                <option value="district1">Quận 1</option>
                <option value="district2">Quận 2</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ward" className="form-label">
                Phường/Xã <span className="required">(*)</span>
              </label>
              <select
                id="ward"
                name="ward"
                className="form-select"
                value={formData.ward}
                onChange={handleChange}
                required
              >
                <option value="">Chọn phường xã</option>
                <option value="ward1">Phường 1</option>
                <option value="ward2">Phường 2</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="packaging" className="form-label">
              Đóng Gói <span className="required">(*)</span>
            </label>
            <select
              id="packaging"
              name="packaging"
              className="form-select"
              value={formData.packaging}
              onChange={handleChange}
              required
            >
              <option value="">Chọn quy cách đóng gói</option>
              <option value="standard">Tiêu chuẩn</option>
              <option value="gift">Gói quà</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="paymentMethod" className="form-label">
              Hình thức thanh toán <span className="required">(*)</span>
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              className="form-select"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="">Chọn hình thức</option>
              <option value="cod">Thanh toán khi nhận hàng</option>
              <option value="bank">Chuyển khoản</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Ghi chú
            </label>
            <textarea
              id="notes"
              name="notes"
              className="form-textarea"
              placeholder="Ghi chú về đơn hàng"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <Link to="/">
          <button type="submit" className="submit-button">
            ĐẶT HÀNG
          </button>
        </Link>
      </div>
    </form>
  );
}

export default CheckoutForm;
