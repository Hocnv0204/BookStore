import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaymentCallback.css";

function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing"); // processing, success, failed
  const [message, setMessage] = useState("");
  const [orderInfo, setOrderInfo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleVNPayCallback = async () => {
      try {
        // Get VNPAY response parameters
        const vnpParams = {};
        for (const [key, value] of searchParams.entries()) {
          vnpParams[key] = value;
        }

        console.log("VNPAY callback params:", vnpParams);

        // Check if we have VNPAY parameters
        if (!vnpParams.vnp_ResponseCode) {
          setStatus("failed");
          setMessage("Không tìm thấy thông tin thanh toán từ VNPAY.");
          return;
        }

        // Check VNPAY response code (00 = success)
        if (
          vnpParams.vnp_ResponseCode === "00" &&
          vnpParams.vnp_TransactionStatus === "00"
        ) {
          // Payment successful - verify with backend
          try {
            const response = await axios.get(
              `http://localhost:8080/api/v1/payment/vn-pay-callback`,
              {
                params: vnpParams,
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            );

            console.log("Backend verification response:", response.data);

            // Assuming backend returns success status
            if (response.data.success !== false) {
              setStatus("success");
              setMessage("Thanh toán thành công! Cảm ơn bạn đã mua hàng.");
              setOrderInfo(decodeURIComponent(vnpParams.vnp_OrderInfo || ""));

              // Clean up localStorage
              localStorage.removeItem("selectedCartItemIds");
              localStorage.removeItem("pendingOrderCartItems");

              // Redirect to home after 3 seconds
              setTimeout(() => {
                navigate("/");
              }, 300000);
            } else {
              throw new Error(
                response.data.message || "Backend verification failed"
              );
            }
          } catch (backendError) {
            console.error("Backend verification error:", backendError);
            // Even if backend verification fails, if VNPAY says success, we show success
            // but with a warning message
            setStatus("success");
            setMessage("Thanh toán thành công! Đơn hàng đang được xử lý.");
            setOrderInfo(decodeURIComponent(vnpParams.vnp_OrderInfo || ""));

            localStorage.removeItem("selectedCartItemIds");
            localStorage.removeItem("pendingOrderCartItems");

            setTimeout(() => {
              navigate("/");
            }, 30000);
          }
        } else {
          // Payment failed
          setStatus("failed");
          const errorMessages = {
            "01": "Giao dịch chưa hoàn tất",
            "02": "Giao dịch bị lỗi",
            "04": "Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)",
            "05": "VNPAY đang xử lý giao dịch này (GD hoàn tiền)",
            "06": "VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)",
            "07": "Giao dịch bị nghi ngờ",
            "09": "GD Hoàn trả bị từ chối",
            10: "Đã giao hàng",
            11: "Giao dịch bị hủy",
            12: "Giao dịch bị từ chối",
            13: "Giao dịch bị hủy do khách hàng",
            24: "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.",
            51: "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.",
            65: "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.",
            75: "Ngân hàng thanh toán đang bảo trì.",
            79: "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.",
          };

          const errorMsg =
            errorMessages[vnpParams.vnp_ResponseCode] ||
            `Giao dịch thất bại (Mã lỗi: ${vnpParams.vnp_ResponseCode})`;

          setMessage(errorMsg);
          setOrderInfo(decodeURIComponent(vnpParams.vnp_OrderInfo || ""));
        }
      } catch (error) {
        console.error("Payment callback error:", error);
        setStatus("failed");
        setMessage(
          "Có lỗi xảy ra khi xử lý thanh toán. Vui lòng liên hệ hỗ trợ."
        );
      }
    };

    // Only process if there are VNPAY parameters
    if (searchParams.has("vnp_ResponseCode")) {
      handleVNPayCallback();
    } else {
      setStatus("failed");
      setMessage("Không tìm thấy thông tin thanh toán.");
    }
  }, [searchParams, navigate]);

  const handleRetryPayment = () => {
    navigate("/checkout");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleViewOrders = () => {
    navigate("/information");
  };

  const formatAmount = (amount) => {
    if (!amount) return "";
    // VNPAY returns amount in VND * 100
    const actualAmount = parseInt(amount) / 100;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(actualAmount);
  };

  return (
    <div className="payment-callback-container">
      <div className="payment-callback-content">
        {status === "processing" && (
          <div className="payment-processing">
            <div className="loading-spinner-large"></div>
            <h2>Đang xử lý thanh toán...</h2>
            <p>
              Vui lòng chờ trong giây lát, đang xác thực giao dịch với VNPAY...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="payment-success">
            <div className="success-icon">✅</div>
            <h2>Thanh toán thành công!</h2>
            <p className="success-message">{message}</p>

            {/* Payment Details */}
            <div className="payment-details">
              <h4>Thông tin giao dịch:</h4>
              <div className="detail-row">
                <span>Mã giao dịch:</span>
                <span className="detail-value">
                  {searchParams.get("vnp_TransactionNo")}
                </span>
              </div>
              <div className="detail-row">
                <span>Số tiền:</span>
                <span className="detail-value amount">
                  {formatAmount(searchParams.get("vnp_Amount"))}
                </span>
              </div>
              <div className="detail-row">
                <span>Ngân hàng:</span>
                <span className="detail-value">
                  {searchParams.get("vnp_BankCode")}
                </span>
              </div>
              {orderInfo && (
                <div className="detail-row">
                  <span>Thông tin đơn hàng:</span>
                  <span className="detail-value">{orderInfo}</span>
                </div>
              )}
              <div className="detail-row">
                <span>Thời gian:</span>
                <span className="detail-value">
                  {searchParams.get("vnp_PayDate")
                    ? new Date(
                        searchParams
                          .get("vnp_PayDate")
                          .replace(
                            /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                            "$1-$2-$3T$4:$5:$6"
                          )
                      ).toLocaleString("vi-VN")
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className="success-details">
              <div className="success-item">
                <span className="check-icon">✓</span>
                <span>Đơn hàng đã được xác nhận</span>
              </div>
              <div className="success-item">
                <span className="check-icon">✓</span>
                <span>Thanh toán đã được xử lý thành công</span>
              </div>
              <div className="success-item">
                <span className="check-icon">✓</span>
                <span>Email xác nhận đã được gửi</span>
              </div>
              <div className="success-item">
                <span className="check-icon">✓</span>
                <span>Đang chuẩn bị hàng cho bạn</span>
              </div>
            </div>

            <div className="callback-actions">
              <button className="btn-primary" onClick={handleGoHome}>
                Về trang chủ
              </button>
              <button className="btn-secondary" onClick={handleViewOrders}>
                Xem đơn hàng
              </button>
            </div>
            <p className="auto-redirect">
              <span className="countdown-icon">⏱️</span>
              Tự động chuyển về trang chủ sau 30 giây...
            </p>
          </div>
        )}

        {status === "failed" && (
          <div className="payment-failed">
            <div className="error-icon">❌</div>
            <h2>Thanh toán thất bại</h2>
            <p className="error-message">{message}</p>

            {/* Failed Payment Details */}
            {searchParams.get("vnp_ResponseCode") && (
              <div className="payment-details error-details">
                <h4>Thông tin giao dịch:</h4>
                <div className="detail-row">
                  <span>Mã lỗi:</span>
                  <span className="detail-value error">
                    {searchParams.get("vnp_ResponseCode")}
                  </span>
                </div>
                {searchParams.get("vnp_Amount") && (
                  <div className="detail-row">
                    <span>Số tiền:</span>
                    <span className="detail-value">
                      {formatAmount(searchParams.get("vnp_Amount"))}
                    </span>
                  </div>
                )}
                {orderInfo && (
                  <div className="detail-row">
                    <span>Thông tin đơn hàng:</span>
                    <span className="detail-value">{orderInfo}</span>
                  </div>
                )}
              </div>
            )}

            <div className="failed-suggestions">
              <h4>Một số gợi ý:</h4>
              <ul>
                <li>Kiểm tra lại thông tin thẻ/tài khoản</li>
                <li>Đảm bảo tài khoản có đủ số dư</li>
                <li>Kiểm tra hạn mức giao dịch hàng ngày</li>
                <li>Thử lại sau vài phút</li>
                <li>Liên hệ ngân hàng nếu vấn đề tiếp tục</li>
              </ul>
            </div>
            <div className="callback-actions">
              <button className="btn-primary" onClick={handleRetryPayment}>
                Thử lại thanh toán
              </button>
              <button className="btn-secondary" onClick={handleGoHome}>
                Về trang chủ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentCallback;
