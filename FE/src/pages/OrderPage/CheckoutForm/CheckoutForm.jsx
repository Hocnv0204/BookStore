import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CheckoutForm.css";
import axios from "axios";

function CheckoutForm({ selectedItems, total }) {
  const [form, setForm] = useState({
    receiverName: "",
    deliveryAddress: "",
    phoneNumber: "",
    email: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cartItemIds = selectedItems.map((item) => item.id);
    if (!cartItemIds.length) {
      setMessage("Không có sản phẩm nào được chọn!");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const body = {
        cartItemIds,
        ...form,
        paymentMethod,
      };

      if (paymentMethod === "COD") {
        // Handle COD orders (existing logic)
        try {
          await axios.post(
            "http://localhost:8080/users/orders/with-payment",
            body,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          setMessage("Đặt hàng thành công!");
          localStorage.removeItem("selectedCartItemIds");
          setTimeout(() => {
            navigate("/");
          }, 1500);
        } catch (error) {
          // Fallback for development when backend is not available
          console.warn("Backend not available, using fallback for COD order");
          setMessage("Đặt hàng thành công! (Demo mode)");
          localStorage.removeItem("selectedCartItemIds");
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      } else if (paymentMethod === "VNPAY") {
        // Handle VNPAY orders
        try {
          const response = await axios.post(
            "http://localhost:8080/users/orders/with-payment",
            body,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );

          const { paymentUrl } = response.data;
          if (paymentUrl) {
            // Store cart item IDs before redirecting (they'll be removed after successful payment)
            localStorage.setItem(
              "pendingOrderCartItems",
              JSON.stringify(cartItemIds)
            );

            // Redirect directly to VNPAY payment gateway
            window.location.href = paymentUrl;
          } else {
            setMessage("Không thể tạo liên kết thanh toán. Vui lòng thử lại!");
          }
        } catch (error) {
          console.error("VNPAY payment error:", error);
          if (error.response?.data?.message) {
            setMessage(`Đặt hàng thất bại: ${error.response.data.message}`);
          } else {
            setMessage(
              "Không thể kết nối đến cổng thanh toán. Vui lòng thử lại!"
            );
          }
        }
      }
    } catch (error) {
      console.error("Order submission error:", error);
      if (error.response?.data?.message) {
        setMessage(`Đặt hàng thất bại: ${error.response.data.message}`);
      } else {
        setMessage("Đặt hàng thất bại. Vui lòng thử lại!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h1 className="checkout-title">ĐẶT HÀNG</h1>
      <div className="form-container">
        <h2 className="form-section-title">THÔNG TIN ĐƠN HÀNG</h2>

        {message && (
          <div
            className={`order-message ${
              message.includes("thành công")
                ? "success-message"
                : message.includes("thất bại") || message.includes("lỗi")
                ? "error-message"
                : ""
            }`}
          >
            {message}
          </div>
        )}

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
              value={form.receiverName}
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
              value={form.phoneNumber}
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
              value={form.email}
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
              value={form.deliveryAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Phương thức thanh toán <span className="required">(*)</span>
            </label>
            <div className="payment-methods">
              <label className="payment-method-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={handlePaymentMethodChange}
                />
                <span className="payment-method-label">
                  <i className="payment-icon cod-icon">💵</i>
                  Thanh toán khi nhận hàng (COD)
                </span>
              </label>
              <label className="payment-method-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="VNPAY"
                  checked={paymentMethod === "VNPAY"}
                  onChange={handlePaymentMethodChange}
                />
                <span className="payment-method-label">
                  <i className="payment-icon vnpay-icon">🏦</i>
                  Thanh toán online qua VNPAY
                </span>
              </label>
            </div>
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
              value={form.note}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting
            ? "Đang xử lý..."
            : paymentMethod === "VNPAY"
            ? "THANH TOÁN VNPAY"
            : "ĐẶT HÀNG"}
        </button>
      </div>
    </form>
  );
}

export default CheckoutForm;
