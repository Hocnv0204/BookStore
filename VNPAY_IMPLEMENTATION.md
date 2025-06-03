# VNPAY QR Code Payment Implementation

## Overview

This implementation adds VNPAY QR code payment functionality to the BookStore order system, allowing customers to pay for their orders using QR code scanning.

## Features Implemented

### 1. Payment Method Selection

- Added radio button options for payment methods:
  - **COD (Cash on Delivery)** - Traditional payment method
  - **VNPAY** - Online payment with QR code

### 2. QR Code Payment Flow

- When VNPAY is selected, the order submission:
  1. Sends order data to backend endpoint: `POST /users/orders/vnpay-payment`
  2. Receives `paymentUrl` and `orderId` from the backend
  3. Displays QR code modal with the payment URL
  4. Automatically polls payment status every 3 seconds
  5. Shows success/failure notifications based on payment result

### 3. QR Code Modal

- **Features:**
  - Displays QR code generated from VNPAY payment URL
  - Payment instructions for users
  - Real-time payment status checking
  - Loading spinner while waiting for payment
  - Cannot be closed during payment process (to prevent accidental closure)

### 4. Payment Status Polling

- Continuously checks payment status via: `GET /users/orders/{orderId}/payment-status`
- Handles three states:
  - `pending` - Payment in progress
  - `success` - Payment completed successfully
  - `failed` - Payment failed

### 5. Payment Callback Page

- **Route:** `/payment/callback`
- Handles VNPAY redirect callbacks
- Verifies payment with backend: `POST /users/orders/vnpay-callback`
- Shows success/failure messages
- Auto-redirects to homepage on success

### 6. Error Handling & User Experience

- **Success Flow:**
  - Success notification
  - Clear cart items
  - Auto-redirect to homepage after 2 seconds
- **Error Flow:**
  - Clear error messages for payment failures
  - Option to retry payment
  - Maintains form data for easy retry

## Backend API Endpoints Required

The frontend expects these backend endpoints:

```javascript
// Create VNPAY payment
POST /users/orders/vnpay-payment
Body: {
  cartItemIds: [1, 2, 3],
  receiverName: "string",
  deliveryAddress: "string",
  phoneNumber: "string",
  email: "string",
  note: "string",
  paymentMethod: "VNPAY"
}
Response: {
  paymentUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
  orderId: 123
}

// Check payment status
GET /users/orders/{orderId}/payment-status
Response: {
  status: "pending" | "success" | "failed"
}

// Handle payment callback
POST /users/orders/vnpay-callback
Body: { ...vnpayCallbackParams }
Response: {
  success: boolean,
  message: "string"
}
```

## File Structure

```
src/
├── pages/
│   ├── OrderPage/
│   │   └── CheckoutForm/
│   │       ├── CheckoutForm.jsx     # Enhanced with VNPAY payment
│   │       └── CheckoutForm.css     # Added payment & QR modal styles
│   └── PaymentCallback/
│       ├── PaymentCallback.jsx      # Handles VNPAY callbacks
│       ├── PaymentCallback.css      # Payment result page styles
│       └── index.js                 # Export file
└── App.js                          # Added /payment/callback route
```

## Key Components

### CheckoutForm.jsx

- **New State Variables:**

  - `paymentMethod` - COD or VNPAY selection
  - `showQRModal` - Controls QR modal visibility
  - `qrCodeUrl` - VNPAY payment URL for QR generation
  - `orderId` - Order ID for status checking
  - `paymentStatus` - Current payment status

- **New Functions:**
  - `handlePaymentMethodChange()` - Switch between payment methods
  - `checkPaymentStatus()` - Poll payment status
  - `closeQRModal()` - Close QR modal and cleanup

### PaymentCallback.jsx

- Handles VNPAY redirect responses
- Verifies payment with backend
- Shows success/failure UI
- Auto-redirects or provides retry options

## Styling Features

### Payment Methods

- Card-style radio buttons with icons
- Hover effects and focus states
- Responsive design for mobile devices

### QR Modal

- Centered modal with backdrop
- Loading animations
- Payment instructions
- Status indicators
- Mobile-friendly responsive design

### Payment Callback Page

- Full-screen centered layout
- Success/failure animations
- Clear call-to-action buttons
- Auto-redirect notifications

## Dependencies Added

```json
{
  "react-qr-code": "^2.0.11"
}
```

## Usage Instructions

1. **For Customers:**

   - Select items and proceed to checkout
   - Choose "VNPAY" payment method
   - Fill in delivery information
   - Click "THANH TOÁN VNPAY"
   - Scan QR code with banking app
   - Wait for payment confirmation

2. **For Developers:**
   - Ensure backend API endpoints are implemented
   - Configure VNPAY merchant settings on backend
   - Test payment flow in sandbox environment
   - Handle payment webhooks for order status updates

## Security Considerations

- Payment verification happens on backend
- Frontend only displays QR codes and polls status
- Sensitive payment data never stored in frontend
- Callback verification ensures payment authenticity

## Testing

1. **COD Orders:** Should work as before
2. **VNPAY Orders:**
   - Test QR code generation
   - Test payment status polling
   - Test success/failure callbacks
   - Test mobile responsiveness
   - Test error handling

## Browser Support

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes
