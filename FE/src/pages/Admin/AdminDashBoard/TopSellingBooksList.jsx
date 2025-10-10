import "./TopSellingBooksList.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TopSellingBooksList() {
  const [topSellingBooks, setTopSellingBooks] = useState([]);
  const fetchTopSellingBooks = async () => {
    const response = await axios.get("http://localhost:8080/api/books/sales");
    setTopSellingBooks(
      response.data.data
        .sort((a, b) => b.soldQuantity - a.soldQuantity)
        .slice(0, 3)
    );
    console.log(response.data);
  };
  useEffect(() => {
    fetchTopSellingBooks();
  }, []);

  const formatSalesText = (quantity) => {
    if (quantity >= 1000) {
      return `${(quantity / 1000).toFixed(1)}k cuốn đã bán`;
    }
    return `${quantity} cuốn đã bán`;
  };

  return (
    <div className="products-card">
      <div className="products-content">
        <h2 className="products-title">Sản phẩm bán chạy</h2>
        <div className="products-list">
          {topSellingBooks.map((product, index) => (
            <div key={product.id} className="product-item">
              <div className="product-rank">
                <span>{index + 1}</span>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.bookTitle}</h3>
                <p className="product-author">{product.author}</p>
              </div>
              <div className="product-sales">
                <p>{formatSalesText(product.soldQuantity)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
