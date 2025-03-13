import "./Header.css";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="home-link">
          <svg
            className="logo"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8h40v48H12V8z"
              stroke="white"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M12 8c0 16 40 16 40 0M12 56c0-16 40-16 40 0"
              stroke="white"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M32 8v48"
              stroke="white"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M26 22h-8M26 32h-8M26 42h-8"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <span className="site-name">Book Store</span>
        </Link>

        <div className="search-container">
          <input type="text" placeholder="Tìm kiếm" className="search-input" />
          <button className="search-button">
            <svg
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        <div className="header-actions">
          <Link to="/account" className="header-link">
            Tài khoản của bạn
          </Link>
          <Link to="/cart" className="header-link cart-link">
            <span>Giỏ hàng (0)</span>
            <svg
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
