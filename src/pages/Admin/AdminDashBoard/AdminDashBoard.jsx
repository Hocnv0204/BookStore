import OverviewWidget from "./OverviewWidget";
import RecentOrdersTable from "./RecentOrdersTable";
import TopSellingBooksList from "./TopSellingBooksList";
import RevenueChart from "./RevenueChart";
import AdminLayout from "./AdminLayout";
import "./AdminDashBoard.css";

export default function AdminDashBoard() {
  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1 className="page-title">Tổng quan</h1>

        <OverviewWidget />

        <div className="dashboard-grid">
          <div className="orders-container">
            <RecentOrdersTable />
          </div>
          <div className="products-container">
            <TopSellingBooksList />
          </div>
        </div>

        <RevenueChart />
      </div>
    </AdminLayout>
  );
}
