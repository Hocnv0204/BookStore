import React, { useState } from "react";
import "./ForgotPassword.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Một liên kết đặt lại mật khẩu đã được gửi đến: ${email}`);
  };

  return (
    <div className="forgot-password">
      <Header />
      <div className="forgot-password-container">
        <h2>Quên Mật Khẩu</h2>
        <p>Nhập email của bạn để nhận liên kết đặt lại mật khẩu.</p>
        <form onSubmit={handleSubmit}>
          <label>Email *</label>
          <input
            type="email"
            placeholder="Nhập email của bạn..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-forgot-password"
          />
          <button type="submit" className="reset-button">
            Gửi yêu cầu
          </button>
        </form>
        <a href="/auth/signin" className="back-to-login">
          Quay lại đăng nhập
        </a>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
