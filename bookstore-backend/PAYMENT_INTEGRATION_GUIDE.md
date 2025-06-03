# Tích hợp Payment với Order System

## Tổng quan

Đã tích hợp thành công hệ thống thanh toán online (VNPay) với hệ thống đặt hàng của BookStore. Người dùng có thể chọn phương thức thanh toán khi tạo đơn hàng và được redirect đến trang thanh toán của VNPay nếu chọn thanh toán online.

## Các tính năng đã implement

### 1. Payment Methods & Status

#### PaymentMethod Enum

- `CASH`: Thanh toán khi nhận hàng (COD)
- `VNPAY`: Thanh toán online qua VNPay
- `MOMO`: Thanh toán qua MoMo (chuẩn bị cho tương lai)

#### PaymentStatus Enum

- `PENDING`: Chờ thanh toán
- `PAID`: Đã thanh toán
- `FAILED`: Thanh toán thất bại
- `REFUNDED`: Đã hoàn tiền

### 2. Order Model Enhancements

Đã thêm các trường payment vào Order model:

- `paymentMethod`: Phương thức thanh toán
- `paymentStatus`: Trạng thái thanh toán
- `paymentTransactionId`: Mã giao dịch từ nhà cung cấp thanh toán
- `paymentUrl`: URL thanh toán (cho online payment)

### 3. API Endpoints

#### OrderController

- `POST /users/orders/with-payment`: Tạo đơn hàng với tích hợp thanh toán
  - Trả về `OrderPaymentResponse` chứa thông tin order và URL thanh toán (nếu là online payment)

#### PaymentController

- `POST /api/v1/payment/create-order`: Tạo đơn hàng với payment qua PaymentService
- `GET /api/v1/payment/vn-pay-callback`: Xử lý callback từ VNPay
- `GET /api/v1/payment/status/{transactionId}`: Kiểm tra trạng thái thanh toán
- `GET /api/v1/payment/success`: Redirect sau khi thanh toán thành công
- `GET /api/v1/payment/failed`: Redirect khi thanh toán thất bại

### 4. Service Layer

#### OrderService

- `createOrderWithPayment()`: Tạo đơn hàng với payment integration
- `updatePaymentStatus()`: Cập nhật trạng thái thanh toán

#### PaymentService

- `createOrderWithPayment()`: Delegate tạo order với payment
- `handleVnPayCallback()`: Xử lý callback từ VNPay và cập nhật trạng thái order
- `checkPaymentStatus()`: Kiểm tra trạng thái thanh toán

### 5. Request/Response DTOs

#### OrderRequest

Đã thêm trường `paymentMethod` để người dùng có thể chọn phương thức thanh toán

#### OrderPaymentResponse

```json
{
  "order": {
    /* OrderDto */
  },
  "paymentUrl": "URL_TO_PAYMENT_GATEWAY",
  "message": "Thông báo cho người dùng"
}
```

## Flow hoạt động

### 1. Thanh toán COD (Cash on Delivery)

1. Người dùng tạo đơn hàng với `paymentMethod = CASH`
2. Order được tạo với `paymentStatus = PENDING`
3. Trả về response với message "Thanh toán khi nhận hàng"

### 2. Thanh toán VNPay

1. Người dùng tạo đơn hàng với `paymentMethod = VNPAY`
2. Order được tạo với `paymentStatus = PENDING`
3. Hệ thống generate URL thanh toán VNPay
4. Trả về response với `paymentUrl` để redirect người dùng
5. Người dùng thực hiện thanh toán trên VNPay
6. VNPay gọi callback endpoint với kết quả thanh toán
7. Hệ thống cập nhật `paymentStatus` của order dựa trên kết quả:
   - Thành công: `PAID` và `orderStatus = CONFIRM`
   - Thất bại: `FAILED` và `orderStatus = CANCELLED`

## Ví dụ sử dụng

### Tạo đơn hàng với COD

```bash
POST /users/orders/with-payment
Content-Type: application/json

{
  "cartItemIds": [1, 2, 3],
  "receiverName": "Nguyễn Văn A",
  "deliveryAddress": "123 Đường ABC, Quận 1, TP.HCM",
  "phoneNumber": "0901234567",
  "email": "user@example.com",
  "note": "Giao hàng giờ hành chính",
  "paymentMethod": "CASH"
}
```

### Tạo đơn hàng với VNPay

```bash
POST /users/orders/with-payment
Content-Type: application/json

{
  "cartItemIds": [1, 2, 3],
  "receiverName": "Nguyễn Văn A",
  "deliveryAddress": "123 Đường ABC, Quận 1, TP.HCM",
  "phoneNumber": "0901234567",
  "email": "user@example.com",
  "note": "Giao hàng giờ hành chính",
  "paymentMethod": "VNPAY"
}
```

Response với VNPay:

```json
{
  "order": {
    "id": 123,
    "totalAmount": 500000,
    "paymentMethod": "VNPAY",
    "paymentStatus": "PENDING"
    // ... các trường khác
  },
  "paymentUrl": "/api/v1/payment/vn-pay?amount=500000&orderId=123",
  "message": "Đơn hàng đã được tạo. Vui lòng hoàn tất thanh toán."
}
```

## Cấu hình VNPay

Các cấu hình VNPay được định nghĩa trong `application.yml`:

```yaml
payment:
  vnPay:
    url: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
    returnUrl: http://localhost:8080/api/v1/payment/vn-pay-callback
    tmnCode: YOUR_TMN_CODE
    secretKey: YOUR_SECRET_KEY
    version: 2.1.0
    command: pay
    orderType: other
```

## Bảo mật

- Tất cả payment endpoints đều yêu cầu authentication
- VNPay callback được xác thực thông qua secure hash
- Sensitive payment information không được log ra console

## Testing

Có thể test payment integration bằng cách:

1. Tạo đơn hàng qua endpoint `/users/orders/with-payment`
2. Sử dụng VNPay sandbox environment để test thanh toán
3. Kiểm tra callback xử lý đúng kết quả thanh toán
4. Verify order status được update chính xác

📋 **Xem chi tiết testing guide**: [PAYMENT_API_TEST_GUIDE.md](PAYMENT_API_TEST_GUIDE.md)

### Quick Test Commands

#### Test COD Order

```bash
curl -X POST "http://localhost:8080/users/orders/with-payment" \
-H "Authorization: Bearer {jwt-token}" \
-H "Content-Type: application/json" \
-d '{
  "cartItemIds": [1, 2],
  "receiverName": "Test User",
  "deliveryAddress": "123 Test Street",
  "phoneNumber": "0901234567",
  "email": "test@example.com",
  "paymentMethod": "CASH"
}'
```

#### Test VNPay Order

```bash
curl -X POST "http://localhost:8080/users/orders/with-payment" \
-H "Authorization: Bearer {jwt-token}" \
-H "Content-Type: application/json" \
-d '{
  "cartItemIds": [1, 2],
  "receiverName": "Test User VNPay",
  "deliveryAddress": "123 Payment Street",
  "phoneNumber": "0987654321",
  "email": "vnpaytest@example.com",
  "paymentMethod": "VNPAY"
}'
```

## Roadmap

### Các tính năng sẽ phát triển:

1. Tích hợp MoMo payment
2. Refund functionality
3. Payment analytics và reporting
4. Scheduled payment status sync
5. Payment webhook security improvements
