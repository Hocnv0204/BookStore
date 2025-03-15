import "./OrderDetails.css";

function OrderDetails({
  productName = "GIA TÍNH LINH DI LỤC - TẬP 1",
  productId = "id_5141",
  quantity = 1,
  weight = "0.5 Kg",
  price = 168000,
  shippingFee = 0,
}) {
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN");
  };

  return (
    <div className="order-details">
      <h2 className="order-details-title">Chi tiết đơn</h2>
      <div className="order-details-content">
        <div className="product-info">
          <h3 className="product-name">{productName}</h3>
          <p className="product-id">Mã SP: {productId}</p>
          <p className="product-quantity">Số lượng: {quantity}</p>
          <p className="product-weight">Khối lượng: {weight}</p>
          <div className="price">{formatPrice(price)} đ</div>
        </div>

        <div className="order-summary">
          <div className="summary-row">
            <span>Tổng tiền:</span>
            <span className="summary-value">{formatPrice(price)} đ</span>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển:</span>
            <span>{formatPrice(shippingFee)} đ</span>
          </div>
          <div className="summary-row total">
            <span>Thanh toán:</span>
            <span>{formatPrice(price + shippingFee)} đ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
