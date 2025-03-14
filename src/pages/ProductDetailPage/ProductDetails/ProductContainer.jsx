import React from "react";
import "./ProductContainer.css";
import ProductDetails from "./ProductDetails";

function ProductContainer({ title, author, price, image }) {
  return (
    <div className="product-container">
      {/* Product Image */}
      <div className="product-image-container">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="product-image"
        />
      </div>

      {/* Product Details */}
      <ProductDetails title={title} author={author} price={price} />
    </div>
  );
}

export default ProductContainer;
