import React from "react";
import "./ShoppingCart.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CartItem from "./CartItem/CartItem";
import CartSummary from "./CartSummary/CartSummary";
import { booksData } from "../../data/booksData";
const ShoppingCart = () => {
  const cartItems = booksData.slice(0, 4).map((item) => ({
    ...item,
    quantity: 3,
    originalPrice: item.price + 10000,
  }));

  const handleQuantityChange = (id, value) => {
    console.log("Quantity changed:", id, value);
  };

  const handleDelete = (id) => {
    console.log("Delete item:", id);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
