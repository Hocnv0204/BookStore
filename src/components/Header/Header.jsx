import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Lỗi khi parse user:", err);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  const fetchCart = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      const res = await axios.get("http://localhost:8080/users/cart", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data && res.data.content && res.data.content.length > 0) {
        setCart(res.data.content[0]); // Lấy cart đầu tiên từ mảng content
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart(null);
    }
  };

  // Thêm useEffect để theo dõi thay đổi của cart
  useEffect(() => {
    console.log("Cart updated:", cart);
  }, [cart]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      localStorage.removeItem("user");
      setUser(null);
      setCart(null);
      return;
    }

    loadUser();
    fetchCart();

    // Tự cập nhật khi tab khác login/logout
    const onStorageChange = (e) => {
      if (e.key === "user") {
        loadUser();
      }
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setCart(null);
  };

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const getTotalItems = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
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
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Tìm kiếm sách..."
              className="search-input"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button type="submit" className="search-button">
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
          </form>
        </div>

        <div className="header-actions">
          <Link to="/auth/signin" className="header-link">
            <div
              className="account-menu"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <span className="account-text">
                {user?.username
                  ? `Xin chào, ${user.fullName}`
                  : "Tài khoản của bạn"}
              </span>
              {user && isOpen && (
                <div className="dropdown-menu">
                  {!user.roles.includes("ADMIN") && (
                    <Link to="/information">Quản lý tài khoản</Link>
                  )}
                  {user.roles.includes("ADMIN") && (
                    <Link to="/admin">Quản lý </Link>
                  )}
                  <Link to="/ " onClick={() => handleLogout()}>
                    Đăng xuất
                  </Link>
                </div>
              )}
              {!user && isOpen && (
                <div className="dropdown-menu">
                  <Link to="/auth/signin">Đăng nhập</Link>
                  <Link to="/auth/signup">Đăng ký</Link>
                </div>
              )}
            </div>
          </Link>
          {user && !user.roles.includes("ADMIN") && (
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
              <span className="cart-count">{getTotalItems()}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
