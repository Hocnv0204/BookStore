import React from "react";
import "./CartItem.css";

const CartItem = ({ cartItems, handleQuantityChange, handleDelete }) => {
  return (
    <div className="main-cart-item">
      <h1>GIỎ HÀNG</h1>
      <table className="cart-items">
        <thead>
          <tr>
            <th className="column-product">Sản phẩm</th>
            <th className="column-quantity">Số lượng</th>
            <th className="column-price">Thành tiền</th>
            <th className="column-action">Xóa</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id} className="cart-item">
              <td className="item-product">
                <div className="product-info">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h3>{item.title}</h3>
                    <p className="item-code">Mã SP {item.id}</p>
                    <div className="item-price">
                      <span className="current-price">
                        {item.price.toLocaleString()} đ
                      </span>
                      <span className="original-price">
                        {item.originalPrice.toLocaleString()} đ
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="item-quantity">
                <select
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, parseInt(e.target.value))
                  }
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </td>
              <td className="item-total">
                {(item.price * item.quantity).toLocaleString()} đ
              </td>
              <td className="item-delete">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="delete-button"
                >
                  <i className="fas fa-trash"></i>
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
