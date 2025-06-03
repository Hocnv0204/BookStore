# API Test Examples for createOrderWithPayment Endpoint

## Overview

The `createOrderWithPayment` endpoint allows users to create orders with integrated payment processing. This document provides comprehensive test examples and input samples for testing the API.

## Base Information

- **Endpoint**: `POST /users/orders/with-payment`
- **Authentication**: Required (Bearer Token)
- **Content-Type**: `application/json`

## Prerequisites

1. **User Authentication**: Valid JWT token
2. **Cart Items**: User must have items in cart with valid IDs
3. **Book Availability**: Selected books must be in stock

## Test Scenarios

### 1. Cash on Delivery (COD) Order

#### Request

```bash
curl -X POST "http://localhost:8080/users/orders/with-payment" \
-H "Authorization: Bearer {your-jwt-token}" \
-H "Content-Type: application/json" \
-d '{
  "cartItemIds": [1, 2, 3],
  "receiverName": "Nguyễn Văn A",
  "deliveryAddress": "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM",
  "phoneNumber": "0901234567",
  "email": "nguyenvana@example.com",
  "note": "Giao hàng giờ hành chính (8h-17h)",
  "paymentMethod": "CASH"
}'
```

#### Expected Response

```json
{
  "order": {
    "id": 123,
    "userId": 45,
    "username": "nguyenvana",
    "receiverName": "Nguyễn Văn A",
    "deliveryAddress": "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM",
    "phoneNumber": "0901234567",
    "email": "nguyenvana@example.com",
    "totalAmount": 385000.0,
    "status": "PENDING",
    "note": "Giao hàng giờ hành chính (8h-17h)",
    "paymentMethod": "CASH",
    "paymentStatus": "PENDING",
    "paymentTransactionId": null,
    "paymentUrl": null,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00",
    "items": [
      {
        "id": 201,
        "bookId": 1,
        "bookTitle": "Lập trình Java cơ bản",
        "bookImage": "/images/java-basic.jpg",
        "quantity": 2,
        "price": 125000.0,
        "subtotal": 250000.0
      },
      {
        "id": 202,
        "bookId": 2,
        "bookTitle": "Spring Boot thực hành",
        "bookImage": "/images/spring-boot.jpg",
        "quantity": 1,
        "price": 135000.0,
        "subtotal": 135000.0
      }
    ]
  },
  "paymentUrl": null,
  "message": "Đơn hàng đã được tạo thành công. Thanh toán khi nhận hàng."
}
```

### 2. VNPay Online Payment Order

#### Request

```bash
curl -X POST "http://localhost:8080/users/orders/with-payment" \
-H "Authorization: Bearer {your-jwt-token}" \
-H "Content-Type: application/json" \
-d '{
  "cartItemIds": [4, 5],
  "receiverName": "Trần Thị B",
  "deliveryAddress": "456 Đường Nguyễn Trãi, Phường 7, Quận 5, TP.HCM",
  "phoneNumber": "0987654321",
  "email": "tranthib@example.com",
  "note": "Gọi trước khi giao hàng",
  "paymentMethod": "VNPAY"
}'
```

#### Expected Response

```json
{
  "order": {
    "id": 124,
    "userId": 46,
    "username": "tranthib",
    "receiverName": "Trần Thị B",
    "deliveryAddress": "456 Đường Nguyễn Trãi, Phường 7, Quận 5, TP.HCM",
    "phoneNumber": "0987654321",
    "email": "tranthib@example.com",
    "totalAmount": 520000.0,
    "status": "PENDING",
    "note": "Gọi trước khi giao hàng",
    "paymentMethod": "VNPAY",
    "paymentStatus": "PENDING",
    "paymentTransactionId": "VNPAY_124_1705311000",
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=52000000&vnp_Command=pay&vnp_CreateDate=20240115103000&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+124&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fv1%2Fpayment%2Fvn-pay-callback&vnp_TmnCode=SANDBOX123&vnp_TxnRef=124&vnp_Version=2.1.0&vnp_SecureHash=hash_string",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00",
    "items": [
      {
        "id": 203,
        "bookId": 4,
        "bookTitle": "React.js từ cơ bản đến nâng cao",
        "bookImage": "/images/reactjs.jpg",
        "quantity": 1,
        "price": 180000.0,
        "subtotal": 180000.0
      },
      {
        "id": 204,
        "bookId": 5,
        "bookTitle": "Node.js và Express",
        "bookImage": "/images/nodejs.jpg",
        "quantity": 2,
        "price": 170000.0,
        "subtotal": 340000.0
      }
    ]
  },
  "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=52000000&vnp_Command=pay&vnp_CreateDate=20240115103000&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+124&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fv1%2Fpayment%2Fvn-pay-callback&vnp_TmnCode=SANDBOX123&vnp_TxnRef=124&vnp_Version=2.1.0&vnp_SecureHash=hash_string",
  "message": "Đơn hàng đã được tạo. Vui lòng hoàn tất thanh toán."
}
```

### 3. MoMo Payment Order (Future Implementation)

#### Request

```bash
curl -X POST "http://localhost:8080/users/orders/with-payment" \
-H "Authorization: Bearer {your-jwt-token}" \
-H "Content-Type: application/json" \
-d '{
  "cartItemIds": [6],
  "receiverName": "Lê Văn C",
  "deliveryAddress": "789 Đường Cách Mạng Tháng 8, Phường 6, Quận 3, TP.HCM",
  "phoneNumber": "0912345678",
  "email": "levanc@example.com",
  "note": "",
  "paymentMethod": "MOMO"
}'
```

## Postman Collection Examples

### Collection: BookStore Payment Integration

#### Environment Variables

```json
{
  "baseUrl": "http://localhost:8080",
  "authToken": "{{your-jwt-token}}"
}
```

#### Test 1: Create COD Order

- **Method**: POST
- **URL**: `{{baseUrl}}/users/orders/with-payment`
- **Headers**:
  - `Authorization`: `Bearer {{authToken}}`
  - `Content-Type`: `application/json`
- **Body**:

```json
{
  "cartItemIds": [1, 2],
  "receiverName": "Test User COD",
  "deliveryAddress": "123 Test Street, Test District, Test City",
  "phoneNumber": "0901234567",
  "email": "testcod@example.com",
  "note": "Test COD order",
  "paymentMethod": "CASH"
}
```

#### Test 2: Create VNPay Order

- **Method**: POST
- **URL**: `{{baseUrl}}/users/orders/with-payment`
- **Headers**:
  - `Authorization`: `Bearer {{authToken}}`
  - `Content-Type`: `application/json`
- **Body**:

```json
{
  "cartItemIds": [3, 4, 5],
  "receiverName": "Test User VNPay",
  "deliveryAddress": "456 Payment Street, Online District, Digital City",
  "phoneNumber": "0987654321",
  "email": "testvnpay@example.com",
  "note": "Test VNPay online payment",
  "paymentMethod": "VNPAY"
}
```

## Error Scenarios

### 1. Invalid Cart Items

#### Request

```json
{
  "cartItemIds": [999, 1000],
  "receiverName": "Test User",
  "deliveryAddress": "Test Address",
  "phoneNumber": "0901234567",
  "email": "test@example.com",
  "paymentMethod": "CASH"
}
```

#### Expected Error Response

```json
{
  "code": 1002,
  "message": "Invalid request",
  "details": "Cart items not found or not accessible"
}
```

### 2. Missing Required Fields

#### Request

```json
{
  "cartItemIds": [1, 2],
  "paymentMethod": "CASH"
}
```

#### Expected Error Response

```json
{
  "code": 1002,
  "message": "Invalid request",
  "details": "Required fields are missing: receiverName, deliveryAddress, phoneNumber, email"
}
```

### 3. Insufficient Stock

#### Request

```json
{
  "cartItemIds": [1],
  "receiverName": "Test User",
  "deliveryAddress": "Test Address",
  "phoneNumber": "0901234567",
  "email": "test@example.com",
  "paymentMethod": "CASH"
}
```

#### Expected Error Response

```json
{
  "code": 1005,
  "message": "Insufficient stock",
  "details": "Book 'Java Programming' has only 2 items left, but you requested 5"
}
```

### 4. Unauthorized Access

#### Request (Without Authorization Header)

```bash
curl -X POST "http://localhost:8080/users/orders/with-payment" \
-H "Content-Type: application/json" \
-d '{"cartItemIds": [1], "paymentMethod": "CASH"}'
```

#### Expected Error Response

```json
{
  "code": 1006,
  "message": "Unauthorized",
  "details": "Access token is required"
}
```

## Testing Tips

### 1. Authentication Setup

```bash
# First, login to get JWT token
curl -X POST "http://localhost:8080/auth/login" \
-H "Content-Type: application/json" \
-d '{
  "username": "testuser",
  "password": "password123"
}'

# Extract token from response
export JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Cart Setup

```bash
# Add items to cart before testing
curl -X POST "http://localhost:8080/users/cart/add" \
-H "Authorization: Bearer $JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "bookId": 1,
  "quantity": 2
}'
```

### 3. Verify Order Creation

```bash
# Check created order
curl -X GET "http://localhost:8080/users/orders/{orderId}" \
-H "Authorization: Bearer $JWT_TOKEN"
```

### 4. Test Payment Flow

```bash
# For VNPay orders, access the payment URL
# The payment URL will redirect to VNPay sandbox
# After payment, VNPay will callback to update order status
```

## Database State After Tests

### Orders Table

```sql
-- Check created orders
SELECT id, user_id, total_amount, payment_method, payment_status, payment_transaction_id
FROM orders
WHERE created_at >= CURDATE()
ORDER BY created_at DESC;
```

### Order Items Table

```sql
-- Check order items
SELECT oi.*, b.title as book_title
FROM order_items oi
JOIN books b ON oi.book_id = b.id
WHERE oi.order_id IN (SELECT id FROM orders WHERE created_at >= CURDATE());
```

### Cart Items (Should be removed after order creation)

```sql
-- Verify cart items are removed
SELECT * FROM cart_items WHERE user_id = {test_user_id};
```

## Frontend Integration

### JavaScript Example

```javascript
// Create order with VNPay payment
async function createOrderWithPayment(orderData) {
  try {
    const response = await fetch("/users/orders/with-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (result.paymentUrl) {
      // Redirect to payment page
      window.location.href = result.paymentUrl;
    } else {
      // COD order created successfully
      alert(result.message);
      // Redirect to order confirmation page
      window.location.href = `/orders/${result.order.id}`;
    }
  } catch (error) {
    console.error("Order creation failed:", error);
    alert("Đã xảy ra lỗi khi tạo đơn hàng");
  }
}

// Usage example
const orderData = {
  cartItemIds: [1, 2, 3],
  receiverName: "Nguyễn Văn A",
  deliveryAddress: "123 Đường ABC, Quận 1, TP.HCM",
  phoneNumber: "0901234567",
  email: "user@example.com",
  note: "Giao hàng nhanh",
  paymentMethod: "VNPAY",
};

createOrderWithPayment(orderData);
```

## Performance Testing

### Load Testing with Artillery

```yaml
# artillery-config.yml
config:
  target: "http://localhost:8080"
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Create orders with payment"
    requests:
      - post:
          url: "/users/orders/with-payment"
          headers:
            Authorization: "Bearer {{authToken}}"
            Content-Type: "application/json"
          json:
            cartItemIds: [1, 2]
            receiverName: "Load Test User"
            deliveryAddress: "Load Test Address"
            phoneNumber: "0901234567"
            email: "loadtest@example.com"
            paymentMethod: "CASH"
```

Run with: `artillery run artillery-config.yml`

## Security Testing

### 1. SQL Injection Test

```bash
# Try SQL injection in cart item IDs
curl -X POST "http://localhost:8080/users/orders/with-payment" \
-H "Authorization: Bearer $JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "cartItemIds": ["1; DROP TABLE orders; --"],
  "receiverName": "Test",
  "deliveryAddress": "Test",
  "phoneNumber": "0901234567",
  "email": "test@example.com",
  "paymentMethod": "CASH"
}'
```

### 2. XSS Test

```bash
# Try XSS in receiver name
curl -X POST "http://localhost:8080/users/orders/with-payment" \
-H "Authorization: Bearer $JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "cartItemIds": [1],
  "receiverName": "<script>alert(\"XSS\")</script>",
  "deliveryAddress": "Test Address",
  "phoneNumber": "0901234567",
  "email": "test@example.com",
  "paymentMethod": "CASH"
}'
```

## Monitoring and Logging

### Application Logs to Check

```bash
# Check order creation logs
tail -f logs/application.log | grep "createOrderWithPayment"

# Check payment processing logs
tail -f logs/application.log | grep "VNPay"

# Check error logs
tail -f logs/error.log
```

### Health Check

```bash
# Verify application is running
curl -X GET "http://localhost:8080/actuator/health"
```

This comprehensive testing guide covers all aspects of the `createOrderWithPayment` endpoint, from basic functionality to security and performance testing.
