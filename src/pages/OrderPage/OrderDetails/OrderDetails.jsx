import "./OrderDetails.css";
import axios from "axios";
import { useState, useEffect } from "react";
function OrderDetails() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const calculateTotal = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const fetchCartItems = async () => {
    try {
      const res = await axios.get("http://localhost:8080/users/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (res.data && res.data.content && res.data.content.length > 0) {
        const items = res.data.content[0].items;
        setCartItems(items);
        setTotal(calculateTotal(items));
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
      setTotal(0);
    }
  };
  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div className="order-details">
      <h2 className="order-details-title">Chi tiết đơn hàng</h2>
      <div className="order-details-content">
        <div className="product-list">
          <h3>Sản phẩm:</h3>
          <table className="order-items">
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.bookId}>
                  <td>{item.bookTitle}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="order-summary">
          <div className="summary-row total">
            <span>Thanh toán: {total.toLocaleString("vi-VN")} đ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
