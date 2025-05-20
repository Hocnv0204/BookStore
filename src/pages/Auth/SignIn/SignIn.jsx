import { useState, useEffect } from "react";
import "./SignIn.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/login", {
        username,
        password,
      });
      setIsLoading(false);
      if (
        response.data &&
        response.data.result &&
        response.data.result.accessToken &&
        response.data.result.refreshToken
      ) {
        localStorage.setItem("accessToken", response.data.result.accessToken);
        localStorage.setItem("refreshToken", response.data.result.refreshToken);
        const userRes = await axios.get("http://localhost:8080/users/profile", {
          headers: {
            Authorization: `Bearer ${response.data.result.accessToken}`,
          },
        });
        localStorage.setItem("user", JSON.stringify(userRes.data.result));
      }

      if (JSON.parse(localStorage.getItem("user")).username === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setIsLoading(false);
      if (err.response && err.response.data) {
        console.error("Lỗi từ server:", err.response.data);
        console.log(err.response.data.message);
        console.log(err.response.data);
        if (err.response.data.message === "User not found") {
          setError("Đăng nhập thất bại: Tài khoản hoặc mật khẩu bị sai");
        } else if (err.response.data.message === "Unauthorized") {
          setError("Đăng nhập thất bại: Tài khoản hoặc mật khẩu bị sai");
        }
      } else if (err.request) {
        console.error("Không nhận được phản hồi từ server:", err.request);
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      } else {
        console.error("Lỗi khi thiết lập request:", err.message);
        setError("Đã có lỗi xảy ra trong quá trình đăng nhập.");
      }
    }
  };
  useEffect(() => {
    // Nếu đã đăng nhập thì chuyển hướng
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/"); // hoặc /admin nếu cần
      return;
    }

    // Xóa localStorage cũ nếu cần
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }, []);
  return (
    <div className="SignIn">
      <Header />
      <div className="login-form-container">
        <h2 className="login-form-title">Đăng Nhập Bằng Tài Khoản</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            {error && <div className="error-message">{error}</div>}

            <label htmlFor="username" className="form-label">
              Tài khoản <span className="required">*</span>
            </label>
            <input
              id="username"
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mật khẩu <span className="required">*</span>
            </label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password-button"
              >
                {showPassword ? (
                  <svg
                    className="icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    className="icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-actions">
            <a href="/forgot-password" className="forgot-password-link">
              Quên mật khẩu?
            </a>
          </div>

          <button type="submit" className="login-button">
            Đăng nhập
          </button>

          <div className="create-account">
            <button
              type="button"
              onClick={() => navigate("/auth/signup")}
              className="create-account-link"
            >
              Tạo tài khoản
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default SignIn;
