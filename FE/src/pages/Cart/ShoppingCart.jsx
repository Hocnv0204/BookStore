import React from "react";
import "./ShoppingCart.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CartItem from "./CartItem/CartItem";
import CartSummary from "./CartSummary/CartSummary";
import ChatBot from "../../components/ChatBot/ChatBot";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      await axios.put(
        `http://localhost:8080/api/carts/users/items/${itemId}?quantity=${newQuantity}`,
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
      await axios.delete(
        `http://localhost:8080/api/carts/users/items/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      fetchCartItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
    window.location.reload();
  };

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
        console.log("Fetched cart items:", items);
        setCartItems(items);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleOrder = () => {
    const cartItemIds =
      selectedItems.length > 0
        ? selectedItems
        : cartItems.map((item) => item.id);
    localStorage.setItem("selectedCartItemIds", JSON.stringify(cartItemIds));
    navigate("/order");
  };

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

  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(item.id)
  );

  return (
    <div className="shopping-cart">
      <Header />
      <div className="cart-container">
        <CartItem
          cartItems={cartItems}
          handleQuantityChange={handleQuantityChange}
          handleDelete={handleDelete}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
        />
        <CartSummary selectedItems={selectedCartItems} onOrder={handleOrder} />
      </div>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default ShoppingCart;
