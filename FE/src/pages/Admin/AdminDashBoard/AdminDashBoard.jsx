import OverviewWidget from "./OverviewWidget";
import RecentOrdersTable from "./RecentOrdersTable";
import TopSellingBooksList from "./TopSellingBooksList";
import RevenueChart from "./RevenueChart";
import AdminLayout from "./AdminLayout";
import "./AdminDashBoard.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashBoard() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrdersToday, setTotalOrdersToday] = useState(0);
  const [totalRevenueToday, setTotalRevenueToday] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchRevenue = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/orders/admin/revenue/daily",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setTotalRevenue(response.data.data.content);
      console.log("total revenue" + response.data);
    } catch (error) {
      console.error("Error fetching total revenue:", error);
    }
  };
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/orders/admin",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setTotalOrders(response.data.data.totalElements);
      setOrders(response.data.data.content);

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];

      // Filter orders created today and not canceled
      const todayOrders = response.data.data.content.filter(
        (order) =>
          order.createdAt.split("T")[0] === today &&
          order.status !== "CANCELLED"
      );

      setTotalOrdersToday(todayOrders.length);
      setTotalRevenueToday(
        todayOrders.reduce((acc, order) => acc + order.totalAmount, 0)
      );
    } catch (error) {
      console.error("Error fetching total orders:", error);
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/users/admin",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setTotalUsers(response.data.data.totalElements);
    } catch (error) {
      console.error("Error fetching total users:", error);
    }
  };
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/books", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setTotalProducts(response.data.data.totalElements);
      console.log(response);
    } catch (error) {
      console.error("Error fetching total products:", error);
    }
  };
  useEffect(() => {
    fetchOrders();
    fetchUsers();
    fetchProducts();
    fetchRevenue();
  }, []);
  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1 className="page-title">Tổng quan</h1>

        <OverviewWidget
          totalOrders={totalOrders}
          totalUsers={totalUsers}
          totalRevenueToday={totalRevenueToday}
          totalProducts={totalProducts}
        />

        <div className="dashboard-grid">
          <div className="orders-container">
            <RecentOrdersTable orders={orders} />
          </div>
          <div className="products-container">
            <TopSellingBooksList />
          </div>
        </div>

        <RevenueChart totalRevenue={totalRevenue} />
      </div>
    </AdminLayout>
  );
}
