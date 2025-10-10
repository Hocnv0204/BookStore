import React, { useState } from "react";
import "./ForgotPassword.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import axios from "axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập code, 3: Đặt mật khẩu mới
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/send-reset-password-code",
        {
          email: email,
        }
      );

      if (response.data.code === 0) {
        setSuccess("Mã xác thực đã được gửi đến email của bạn");
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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/reset-password",
        {
          email: email,
          verificationCode: verificationCode,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }
      );

      if (response.data.code === 0) {
        setSuccess("Đặt lại mật khẩu thành công!");
        setTimeout(() => {
          window.location.href = "/auth/signin";
        }, 2000);
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Không thể đặt lại mật khẩu. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <form onSubmit={handleSendCode}>
      <label>Email *</label>
      <input
        type="email"
        placeholder="Nhập email của bạn..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="input-forgot-password"
        disabled={isLoading}
      />
      <button type="submit" className="reset-button" disabled={isLoading}>
        {isLoading ? "Đang xử lý..." : "Gửi mã xác thực"}
      </button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleResetPassword}>
      <div className="verification-info">
        Mã xác thực đã được gửi đến email {email}
      </div>

      <label>Mã xác thực *</label>
      <input
        type="text"
        placeholder="Nhập mã xác thực..."
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        required
        className="input-forgot-password"
        disabled={isLoading}
      />

      <label>Mật khẩu mới *</label>
      <input
        type="password"
        placeholder="Nhập mật khẩu mới..."
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        className="input-forgot-password"
        disabled={isLoading}
      />

      <label>Xác nhận mật khẩu *</label>
      <input
        type="password"
        placeholder="Nhập lại mật khẩu mới..."
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className="input-forgot-password"
        disabled={isLoading}
      />

      <button type="submit" className="reset-button" disabled={isLoading}>
        {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
      </button>

      <button
        type="button"
        className="back-button"
        onClick={() => setStep(1)}
        disabled={isLoading}
      >
        Quay lại
      </button>
    </form>
  );

  return (
    <div className="forgot-password">
      <Header />
      <div className="forgot-password-container">
        <h2>Quên Mật Khẩu</h2>
        <p>Nhập email của bạn để nhận mã xác thực đặt lại mật khẩu.</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {step === 1 ? renderStep1() : renderStep2()}

        <a href="/auth/signin" className="back-to-login">
          Quay lại đăng nhập
        </a>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
