import React from "react";
import "./CartItem.css";

const CartItem = ({
  cartItems,
  handleQuantityChange,
  handleDelete,
  selectedItems = [],
  onSelectItem,
}) => {
  return (
    <div className="main-cart-item">
      <h1>GIỎ HÀNG</h1>
      <table className="cart-items">
        <thead>
          <tr>
            <th></th>
            <th className="column-product">Sản phẩm</th>
            <th className="column-quantity">Số lượng</th>
            <th className="column-price">Thành tiền</th>
            <th className="column-action">Xóa</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id} className="cart-item">
              <td>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => onSelectItem(item.id)}
                />
              </td>
              <td className="item-product">
                <div className="product-info">
                  <img
                    src={item.bookImage || "/placeholder.svg"}
                    alt={item.bookTitle}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h3>{item.bookTitle}</h3>
                    <div className="item-price">
                      <span className="current-price">{item.price} đ</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="item-quantity">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    let newValue;
                    if (inputValue === "") {
                      newValue = 1;
                    } else {
                      newValue = parseInt(inputValue, 10);
                      if (isNaN(newValue)) {
                        newValue = 1;
                      } else {
                        newValue = Math.max(1, Math.min(999, newValue));
                      }
                    }

                    handleQuantityChange(item.bookId, newValue);
                  }}
                  min="1"
                  max="999"
                  step="1"
                  className="quantity-input"
                />
              </td>
              <td className="item-total">
                {(item.price * item.quantity).toLocaleString()} đ
              </td>
              <td className="item-delete">
                <button
                  onClick={() => handleDelete(item.bookId)}
                  className="delete-button"
                >
                  <i className="fas fa-trash"></i>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartItem;
