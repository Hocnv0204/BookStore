import CheckoutForm from "./CheckoutForm/CheckoutForm";
import OrderDetails from "./OrderDetails/OrderDetails";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ChatBot from "../../components/ChatBot/ChatBot";
import "./Order.css";
import axios from "axios";
import { useState, useEffect } from "react";

function Order() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const calculateTotal = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const fetchCartItems = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/carts/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (
        res.data &&
        res.data.data &&
        res.data.data.content &&
        res.data.data.content.length > 0
      ) {
        const items = res.data.data.content[0].items;
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

  // Lấy danh sách sản phẩm đã chọn từ localStorage
  const selectedCartItemIds =
    JSON.parse(localStorage.getItem("selectedCartItemIds")) || [];

  // Lọc ra các sản phẩm đã chọn từ giỏ hàng
  const selectedItems = cartItems.filter((item) =>
    selectedCartItemIds.includes(item.id)
  );

  return (
    <div className="order-page">
      <Header />
      <main className="main-content">
        <div className="checkout-container">
          <div className="checkout-form-container">
            <CheckoutForm
              selectedItems={selectedItems}
              total={calculateTotal(selectedItems)}
            />
          </div>
          <div className="order-details-container">
            <OrderDetails
              selectedItems={selectedItems}
              total={calculateTotal(selectedItems)}
            />
          </div>
        </div>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}

export default Order;
