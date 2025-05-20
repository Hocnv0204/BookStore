import { useState } from "react";
import "./SignUp.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    const dataToSubmit = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      dob: formData.dateOfBirth,
      gender: formData.gender,
    };

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/register",
        dataToSubmit
      );

      setIsLoading(false);
      console.log("Đăng ký thành công:", response.data);

      if (
        response.data &&
        response.data.accessToken &&
        response.data.refreshToken
      ) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }

      navigate("/");
    } catch (err) {
      setIsLoading(false);
      if (err.response && err.response.data) {
        console.error("Lỗi từ server:", err.response.data);
        if (err.response.data.message === "User already exists") {
          setError("Tên đăng nhập này đã tồn tại. Vui lòng chọn tên khác.");
          console.log(err);
        } else if (err.response.data.message === "Email already exists") {
          setError("Email này đã được sử dụng. Vui lòng sử dụng email khác.");
        } else {
          setError(
            err.response.data.message ||
              "Đăng ký không thành công. Vui lòng thử lại."
          );
        }
      } else if (err.request) {
        console.error("Không nhận được phản hồi từ server:", err.request);
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      } else {
        console.error("Lỗi khi thiết lập request:", err.message);
        setError("Đã có lỗi xảy ra trong quá trình đăng ký.");
      }
    }
  };

  return (
    <div className="SignUp">
      <Header />
      <div className="registration-form-container">
        <h2 className="registration-form-title">Đăng Ký Tài Khoản</h2>
        <form className="registration-form" onSubmit={handleSubmit}>
          {error && (
            <p
              className="error-message"
              style={{
                color: "red",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              {error}
            </p>
          )}

          <div className="form-section">
            <h2>Thông Tin Đăng Nhập</h2>
            <div className="form-group">
              <label>
                Tên đăng nhập <span className="required">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

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
                disabled={isLoading}
              />
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>
                Ngày sinh <span className="required">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth" // Giữ nguyên name ở form
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Giới tính</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                {/* Backend của bạn có thể hỗ trợ các giá trị khác, ví dụ "other" */}
                {/* <option value="other">Khác</option> */}
              </select>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </button>

          <div className="switch-form">
            <button
              type="button"
              onClick={() => navigate("/auth/signin")}
              className="switch-form-link"
              disabled={isLoading}
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
