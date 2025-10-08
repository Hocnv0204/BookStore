import React from "react";
import "./Pagination.css";

function Pagination() {
  return (
    <div className="pagination">
      <div className="pagination-container">
        <button className="pagination-button">0</button>
        <div className="pagination-info">
          <div>Trang hiện tại</div>
          <div className="pagination-dots">
            {[1, 2, 3, 4, 5].map((page) => (
              <div key={page} className="pagination-dot"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
