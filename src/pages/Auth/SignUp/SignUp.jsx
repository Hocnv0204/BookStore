import { useState } from "react";
import "./SignUp.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

function SignUp({ onSwitch }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="SignUp">
      <Header />
      <div className="registration-form-container">
        <h2 className="registration-form-title">Đăng Ký Tài Khoản</h2>
        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Thông Tin Đăng Nhập</h2>

            <div className="form-group">
              <label>
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <span className="hint">Vui lòng nhập email</span>
            </div>

            <div className="form-group">
              <label>
                Mật khẩu <span className="required">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="hint">Mật khẩu phải từ 6-32 ký tự</span>
            </div>

            <div className="form-group">
              <label>
                Xác nhận mật khẩu <span className="required">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span className="hint">Xác nhận lại mật khẩu</span>
            </div>
          </div>

          <div className="form-section">
            <h2>Thông Tin Cá Nhân</h2>

            <div className="form-group">
              <label>
                Họ và tên <span className="required">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Ngày sinh <span className="required">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Giới tính</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Đăng ký
          </button>

          <div className="switch-form">
            <button
              type="button"
              onClick={onSwitch}
              className="switch-form-link"
            >
              Đã có tài khoản? Đăng nhập
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default SignUp;
