import "./OrderTable.css";

function OrderTable({ orders = [] }) {
  return (
    <div className="order-table-container">
      <div className="table-header">
        <h2>DANH SÁCH ĐƠN HÀNG</h2>
        <div className="search-container">
          <input type="text" placeholder="Search" className="search-input" />
        </div>
      </div>

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
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-records">
                  No matching records found
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.orderId}</td>
                  <td>{order.customerName}</td>
                  <td>{order.phone}</td>
                  <td>{order.total}</td>
                  <td>{order.status}</td>
                  <td>
                    <button className="details-button">Xem</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderTable;
