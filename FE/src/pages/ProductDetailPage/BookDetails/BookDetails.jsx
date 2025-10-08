import React from "react";
import "./BookDetails.css";
function BookDetails() {
  return (
    <div className="section">
      <h2 className="section-title">Thông Tin Chi Tiết</h2>
      <div className="details-grid">
        <div className="details-label">Mã hàng:</div>
        <div className="details-value">8935235789876</div>

        <div className="details-label">Nhà xuất bản:</div>
        <div className="details-value">Nhà Xuất Bản Phương Nam</div>

        <div className="details-label">Tác giả:</div>
        <div className="details-value">Jordan B. Peterson</div>

        <div className="details-label">Người dịch:</div>
        <div className="details-value">Trí Nguyễn</div>

        <div className="details-label">NXB:</div>
        <div className="details-value">Lao Động</div>

        <div className="details-label">Năm XB:</div>
        <div className="details-value">2023</div>

        <div className="details-label">Ngôn ngữ:</div>
        <div className="details-value">Tiếng Việt</div>

        <div className="details-label">Trọng lượng (gr):</div>
        <div className="details-value">540</div>

        <div className="details-label">Kích thước bao bì:</div>
        <div className="details-value">20.5 x 13 x 2.8 cm</div>

        <div className="details-label">Số trang:</div>
        <div className="details-value">450</div>

        <div className="details-label">Hình thức:</div>
        <div className="details-value">Bìa Mềm</div>
      </div>
    </div>
  );
}

export default BookDetails;
