import React from "react";
import "./ShoppingCart.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CartItem from "./CartItem/CartItem";
import CartSummary from "./CartSummary/CartSummary";
import axios from "axios";
import { useState, useEffect } from "react";

const ShoppingCart = () => {
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      await axios.put(
        `http://localhost:8080/users/cart/items/${itemId}?quantity=${newQuantity}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      fetchCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/users/cart/items/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      fetchCartItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

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
  if (cartItems.length === 0) {
    return (
      <div className="shopping-cart">
        <Header />
        <div className="cart-container">
          <h1>Giỏ hàng trống</h1>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="shopping-cart">
      <Header />
      <div className="cart-container">
        <CartItem
          cartItems={cartItems}
          handleQuantityChange={handleQuantityChange}
          handleDelete={handleDelete}
        />
        <CartSummary total={total} />
      </div>
      <Footer />
    </div>
  );
};

export default ShoppingCart;
