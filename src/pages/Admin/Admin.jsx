import "./Admin.css";
import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import AdminDashBoard from "./AdminDashBoard/AdminDashBoard";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BookManagement from "./BookManagement/BookManagement";

function Admin() {
  return (
    <div className="admin">
      <Header />
      <div className="admin-container">
        <Sidebar />
        <div className="admin-main">
          <AdminDashBoard />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Admin;
