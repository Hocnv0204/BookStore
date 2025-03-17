import "./Header.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="home-link">
          <img
            src="https://nobita.vn/wp-content/uploads/2018/01/logo-22.png"
            alt="Logo"
          />
          {/* <span className="site-name">Book Store</span> */}
        </Link>

        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm sách..."
            className="search-input"
          />
          <button className="search-button">
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        <div className="header-actions">
          <Link to="/auth/signin" className="header-link">
            <div
              className="account-menu"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <span className="account-text">
                {user ? `Xin chào, ${user.name}` : "Tài khoản của bạn"}
              </span>
              {user && isOpen && (
                <div className="dropdown-menu">
                  <Link to="/information">Quản lý tài khoản</Link>
                  <Link to="/auth/signin" onClick={() => handleLogout}>
                    Đăng xuất
                  </Link>
                </div>
              )}
            </div>
          </Link>
          <Link to="/cart" className="header-link cart-link">
            <span>Giỏ hàng</span>
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="cart-count">4</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
