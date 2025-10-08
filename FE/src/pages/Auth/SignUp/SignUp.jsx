import { useState } from "react";
import "./SignUp.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Thông tin cơ bản, 2: Xác thực email
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    dob: "",
    gender: "",
    verificationCode: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [verificationSent, setVerificationSent] = useState(false);

  // Regex patterns
  const usernameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9_]{6,32}$/;
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,32}$/;
  const fullNameRegex = /^[a-zA-ZÀ-ỹà-ỹ\s]+$/u;

  // Validate all fields, return { isValid, errors }
  const validateForm = () => {
    const errors = {};
    // Username
    if (!formData.username) {
      errors.username = "Tên đăng nhập không được để trống.";
    } else if (!usernameRegex.test(formData.username)) {
      errors.username =
        "Tên đăng nhập phải từ 6-32 ký tự, chỉ gồm chữ, số và dấu gạch dưới (_).";
    }
    // Email
    if (!formData.email) {
      errors.email = "Email không được để trống.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Email không hợp lệ.";
    }
    // Password
    if (!formData.password) {
      errors.password = "Mật khẩu không được để trống.";
    } else if (!passwordRegex.test(formData.password)) {
      errors.password =
        "Mật khẩu phải từ 8-32 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
    }
    // Confirm Password
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Xác nhận mật khẩu không được để trống.";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }
    // Full Name
    if (!formData.fullName) {
      errors.fullName = "Họ và tên không được để trống.";
    } else if (!fullNameRegex.test(formData.fullName)) {
      errors.fullName = "Họ và tên chỉ được chứa chữ cái và khoảng trắng.";
    }
    // Date of Birth
    if (!formData.dob) {
      errors.dob = "Ngày sinh không được để trống.";
    } else {
      const dobDate = new Date(formData.dob);
      const now = new Date();
      if (isNaN(dobDate.getTime()) || dobDate >= now) {
        errors.dob = "Ngày sinh phải là ngày hợp lệ và trong quá khứ.";
      }
    }
    // Gender
    if (!formData.gender) {
      errors.gender = "Vui lòng chọn giới tính.";
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSendVerificationCode = async () => {
    setError(null);
    setFieldErrors({});
    // Validate before sending
    const { isValid, errors } = validateForm();
    if (!isValid) {
      setFieldErrors(errors);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/send-verification-code",
        {
          email: formData.email,
        }
      );
      if (response.data.code === 0) {
        setVerificationSent(true);
        setStep(2);
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Không thể gửi mã xác thực. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    // Validate before submit
    const { isValid, errors } = validateForm();
    if (!isValid) {
      setFieldErrors(errors);
      return;
    }
    if (!formData.verificationCode) {
      setFieldErrors((prev) => ({
        ...prev,
        verificationCode: "Vui lòng nhập mã xác thực.",
      }));
      return;
    }
    const dataToSubmit = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      fullName: formData.fullName,
      dob: formData.dob,
      gender: formData.gender,
      verificationCode: formData.verificationCode,
    };
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/verify-and-register",
        dataToSubmit
      );
      if (response.data.code === 0 && response.data.result) {
        localStorage.setItem("accessToken", response.data.result.accessToken);
        localStorage.setItem("refreshToken", response.data.result.refreshToken);
        const userRes = await axios.get("http://localhost:8080/users/profile", {
          headers: {
            Authorization: `Bearer ${response.data.result.accessToken}`,
          },
        });
        localStorage.setItem("user", JSON.stringify(userRes.data.result));
        navigate("/");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Đăng ký không thành công. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
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
        {fieldErrors.username && (
          <span className="error-message">{fieldErrors.username}</span>
        )}
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
        {fieldErrors.email && (
          <span className="error-message">{fieldErrors.email}</span>
        )}
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
        <span className="hint">
          Mật khẩu phải từ 8-32 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc
          biệt
        </span>
        {fieldErrors.password && (
          <span className="error-message">{fieldErrors.password}</span>
        )}
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
        {fieldErrors.confirmPassword && (
          <span className="error-message">{fieldErrors.confirmPassword}</span>
        )}
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
          {fieldErrors.fullName && (
            <span className="error-message">{fieldErrors.fullName}</span>
          )}
        </div>

        <div className="form-group">
          <label>
            Ngày sinh <span className="required">*</span>
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          {fieldErrors.dob && (
            <span className="error-message">{fieldErrors.dob}</span>
          )}
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
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
          {fieldErrors.gender && (
            <span className="error-message">{fieldErrors.gender}</span>
          )}
        </div>
      </div>

      <button
        type="button"
        className="submit-btn"
        onClick={handleSendVerificationCode}
        disabled={isLoading}
      >
        {isLoading ? "Đang xử lý..." : "Gửi mã xác thực"}
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-section">
      <h2>Xác Thực Email</h2>
      <p className="verification-info">
        Mã xác thực đã được gửi đến email {formData.email}
      </p>

      <div className="form-group">
        <label>
          Mã xác thực <span className="required">*</span>
        </label>
        <input
          type="text"
          name="verificationCode"
          value={formData.verificationCode}
          onChange={handleChange}
          required
          disabled={isLoading}
          placeholder="Nhập mã xác thực từ email"
        />
        {fieldErrors.verificationCode && (
          <span className="error-message">{fieldErrors.verificationCode}</span>
        )}
      </div>

      <button
        type="button"
        className="submit-btn"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Đang xử lý..." : "Hoàn tất đăng ký"}
      </button>

      <button
        type="button"
        className="back-btn"
        onClick={() => setStep(1)}
        disabled={isLoading}
      >
        Quay lại
      </button>
    </div>
  );

  return (
    <div className="SignUp">
      <Header />
      <div className="registration-form-container">
        <h2 className="registration-form-title">Đăng Ký Tài Khoản</h2>
        <form
          className="registration-form"
          onSubmit={(e) => e.preventDefault()}
        >
          {error && <p className="error-message">{error}</p>}

          {step === 1 ? renderStep1() : renderStep2()}

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
