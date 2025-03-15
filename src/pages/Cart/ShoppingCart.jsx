import React from "react";
import "./ShoppingCart.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CartItem from "./CartItem/CartItem";
import CartSummary from "./CartSummary/CartSummary";

const ShoppingCart = () => {
  const cartItems = [
    {
      id: "id_5074",
      image: "https://via.placeholder.com/80x100",
      title: "Tháng 12 - Tập 2 - Tặng Kèm Bookmark",
      price: 126000,
      originalPrice: 168000,
      quantity: 1,
    },
    {
      id: "id_5154",
      image: "https://via.placeholder.com/80x100",
      title: "Tiệm sách cũ Suzuro",
      price: 75000,
      originalPrice: 89000,
      quantity: 1,
    },
  ];

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
