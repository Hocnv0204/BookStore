import "./OrderTable.css";
import { useState } from "react";
import axios from "axios";
import OrderDetailModal from "./OrderDetailModal";
import Pagination from "../../../components/Pagination/Pagination";

function OrderTable({
  orders = [],
  pageNumber = 0,
  pageSize = 10,
  totalElements = 0,
  totalPages = 1,
  last = true,
  onPageChange,
  filterStatus = "all",
  onSort, // Add new prop for sorting
  sortBy, // Add current sort field
  sortOrder, // Add current sort order
}) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmCancelOrder, setConfirmCancelOrder] = useState(null);

  // No need for client-side filtering since we're doing server-side filtering
  const filteredOrders = orders;
  const fetchOrderById = async (id) => {
    setLoadingDetail(true);
    try {
      const res = await axios.get(`http://localhost:8080/users/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setSelectedOrder(res.data);
      console.log(res.data);
    } catch (error) {
      setSelectedOrder(null);
      alert("Không thể lấy chi tiết đơn hàng!");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCancelOrder = async (order) => {
    if (order.status !== "PENDING") {
      setMessage("Chỉ có thể hủy đơn hàng khi trạng thái là PENDING.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    try {
      await axios.post(
        `http://localhost:8080/users/orders/${order.id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMessage("Hủy đơn hàng thành công!");
      setTimeout(() => {
        setMessage("");
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage("Hủy đơn hàng thất bại. Vui lòng thử lại.");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  // Add new function to handle header click
  const handleHeaderClick = (header) => {
    if (onSort) {
      // Map header text to field name for orders
      const fieldMap = {
        "Mã Đơn Hàng": "id",
        "Ngày đặt": "createdAt",
        "Người đặt": "receiverName",
        "Số điện thoại": "phoneNumber",
        "Tổng cộng": "totalAmount",
        "Trạng thái": "status",
      };

      const field = fieldMap[header];
      if (field) {
        const newOrder =
          sortBy === field && sortOrder === "asc" ? "desc" : "asc";
        onSort(field, newOrder);
      }
    }
  };

  // Add function to render sort indicator
  const renderSortIndicator = (header) => {
    const fieldMap = {
      "Mã Đơn Hàng": "id",
      "Ngày đặt": "createdAt",
      "Người đặt": "receiverName",
      "Số điện thoại": "phoneNumber",
      "Tổng cộng": "totalAmount",
      "Trạng thái": "status",
    };

    const field = fieldMap[header];
    if (field !== sortBy) return null;
    return (
      <span className="sort-indicator">
        {sortOrder === "asc" ? " ↑" : " ↓"}
      </span>
    );
  };

  return (
    <div className="order-table">
      <div className="table-header">
        <h2>DANH SÁCH ĐƠN HÀNG</h2>
      </div>

      {message && <div className="order-message">{message}</div>}

      <div className="table-responsive">
        <table className="order-table">
          <thead>
            <tr>
              <th
                onClick={() => handleHeaderClick("Mã Đơn Hàng")}
                className={sortBy === "id" ? "sortable active" : "sortable"}
              >
                Mã Đơn Hàng
                {renderSortIndicator("Mã Đơn Hàng")}
              </th>
              <th
                onClick={() => handleHeaderClick("Ngày đặt")}
                className={
                  sortBy === "createdAt" ? "sortable active" : "sortable"
                }
              >
                Ngày đặt
                {renderSortIndicator("Ngày đặt")}
              </th>
              <th
                onClick={() => handleHeaderClick("Người đặt")}
                className={
                  sortBy === "receiverName" ? "sortable active" : "sortable"
                }
              >
                Người đặt
                {renderSortIndicator("Người đặt")}
              </th>
              <th
                onClick={() => handleHeaderClick("Số điện thoại")}
                className={
                  sortBy === "phoneNumber" ? "sortable active" : "sortable"
                }
              >
                Số điện thoại
                {renderSortIndicator("Số điện thoại")}
              </th>
              <th
                onClick={() => handleHeaderClick("Tổng cộng")}
                className={
                  sortBy === "totalAmount" ? "sortable active" : "sortable"
                }
              >
                Tổng cộng
                {renderSortIndicator("Tổng cộng")}
              </th>
              <th
                onClick={() => handleHeaderClick("Trạng thái")}
                className={sortBy === "status" ? "sortable active" : "sortable"}
              >
                Trạng thái
                {renderSortIndicator("Trạng thái")}
              </th>
              <th>Chi tiết đơn</th>
              <th>Hủy đơn</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-records">
                  Không có đơn hàng
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </td>
                  <td>{order.receiverName}</td>
                  <td>{order.phoneNumber}</td>
                  <td>{order.totalAmount}</td>
                  <td>{order.status}</td>
                  <td>
                    <button
                      className="details-button"
                      onClick={() => fetchOrderById(order.id)}
                    >
                      Xem
                    </button>
                  </td>
                  <td>
                    <button
                      className="cancel-button"
                      onClick={() => setConfirmCancelOrder(order)}
                      disabled={order.status !== "PENDING"}
                    >
                      Hủy đơn
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalElements={totalElements}
        totalPages={totalPages}
        last={last}
        onPageChange={onPageChange}
      />

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          loading={loadingDetail}
        />
      )}

      {confirmCancelOrder && (
        <div className="order-details-modal">
          <div className="order-details-modal-content">
            <h3>
              Bạn có chắc chắn muốn hủy đơn hàng #{confirmCancelOrder.id}?
            </h3>
            <div
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <button
                className="cancel-button"
                onClick={async () => {
                  await handleCancelOrder(confirmCancelOrder);
                  setConfirmCancelOrder(null);
                }}
              >
                Xác nhận hủy
              </button>
              <button
                className="details-button"
                onClick={() => setConfirmCancelOrder(null)}
              >
                Không
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTable;
