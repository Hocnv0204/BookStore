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
}) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmCancelOrder, setConfirmCancelOrder] = useState(null);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  // Lọc theo trạng thái
  let filteredOrders = orders;
  if (filterStatus && filterStatus !== "all") {
    filteredOrders = orders.filter((order) => order.status === filterStatus);
  }

  // FE sort
  let sortedOrders = [...filteredOrders];
  sortedOrders = sortedOrders.sort((a, b) => {
    let v1 = a[sortBy];
    let v2 = b[sortBy];
    if (sortBy === "status") {
      v1 = v1?.toLowerCase() || "";
      v2 = v2?.toLowerCase() || "";
    }
    if (v1 < v2) return sortOrder === "asc" ? -1 : 1;
    if (v1 > v2) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
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
      const res = await axios.post(
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

  return (
    <div className="order-table">
      <div className="table-header">
        <h2>DANH SÁCH ĐƠN HÀNG</h2>
        <div className="order-sort-bar">
          <label>
            Sắp xếp:
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="order-sort-select"
            >
              <option value="id">Mã đơn</option>
              <option value="totalAmount">Tổng cộng</option>
              <option value="status">Trạng thái</option>
            </select>
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="order-sort-select"
          >
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
        </div>
      </div>

      {message && <div className="order-message">{message}</div>}

      <div className="table-responsive">
        <table className="order-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã Đơn Hàng</th>
              <th>Người đặt</th>
              <th>Số điện thoại</th>
              <th>Tổng cộng</th>
              <th>Trạng thái</th>
              <th>Chi tiết đơn</th>
              <th>Hủy đơn</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-records">
                  Không có đơn hàng
                </td>
              </tr>
            ) : (
              sortedOrders.map((order, index) => (
                <tr key={order.id}>
                  <td>{pageNumber * pageSize + index + 1}</td>
                  <td>{order.id}</td>
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
