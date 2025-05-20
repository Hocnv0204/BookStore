import "./OverviewWidget.css";

export default function OverviewWidget() {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <h3 className="stat-title">Tổng số đơn hàng</h3>
          <div className="stat-icon-container">
            <svg
              className="stat-icon"
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
          </div>
        </div>
        <div className="stat-content">
          <p className="stat-value">1,250</p>
          <p className="stat-change">+20.1% so với tháng trước</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <h3 className="stat-title">Doanh thu hôm nay</h3>
          <div className="stat-icon-container">
            <svg
              className="stat-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>
        <div className="stat-content">
          <p className="stat-value">15,800,000đ</p>
          <p className="stat-change">+5.5% so với hôm qua</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <h3 className="stat-title">Tổng sản phẩm</h3>
          <div className="stat-icon-container">
            <svg
              className="stat-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
          </div>
        </div>
        <div className="stat-content">
          <p className="stat-value">865</p>
          <p className="stat-subtitle">Active</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <h3 className="stat-title">Tổng khách hàng</h3>
          <div className="stat-icon-container">
            <svg
              className="stat-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
        </div>
        <div className="stat-content">
          <p className="stat-value">5,230</p>
          <p className="stat-change">+180 trong tháng này</p>
        </div>
      </div>
    </div>
  );
}
