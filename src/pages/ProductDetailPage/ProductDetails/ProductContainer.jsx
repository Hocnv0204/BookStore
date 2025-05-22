import React from "react";
import "./ProductContainer.css";
import ProductDetails from "./ProductDetails";

function ProductContainer({ book }) {
  return (
    <div className="product-container">
      {/* Product Image */}
      <div className="product-image-container">
        <img
          src={book.imageUrl || "/placeholder.svg"}
          alt={book.title}
          className="product-image"
        />
      </div>

      {/* Product Details */}
      <ProductDetails book={book} />
    </div>
  );
}

export default ProductContainer;
