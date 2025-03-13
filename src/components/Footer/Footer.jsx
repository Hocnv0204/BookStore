import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-heading">• Hỗ Trợ Khách Hàng</h3>
          <ul className="footer-list">
            <li>• Email: nguyenhh1102@gmail.com</li>
            <li className="footer-phone">
              • Hotline:
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
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              0349 097 659
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">• Giới Thiệu</h3>
          <ul className="footer-list">
            <li>•About me </li>
            <li>• Quên Mật Khẩu</li>
            <li>• Về nobita</li>
            <li>• Tuyển dụng</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">• Tài Khoản</h3>
          <ul className="footer-list">
            <li>• Anh Trai Tôi Là Đồ Ngốc - Tập 1</li>
            <li>• Bản Đặc Biệt - Đăng Kèm Bookmark + Postcard + Standee</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">• Hướng Dẫn</h3>
          <ul className="footer-list">
            <li>• Hướng dẫn mua hàng</li>
            <li>• Phương thức thanh toán</li>
            <li>• Câu hỏi thường gặp</li>
            <li>• Chính sách vận chuyển</li>
            <li>• Chính sách bảo mật thông tin</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copyright">Copyright © 2025 nguyenhh@gmail.com</div>
        <div className="address">
          Địa chỉ: Km10, Đường Nguyễn Trãi, Q. Hà Đông, Hà Nội
        </div>

        <div className="certification">
          <img
            src="/placeholder.svg?height=50&width=180"
            alt="Certification"
            className="certification-image"
          />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
