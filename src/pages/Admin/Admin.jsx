import "./Admin.css";
import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import BookManagement from "./BookManagement/BookManagement";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function Admin() {
  return (
    <div className="admin">
      <Header />
      <div className="admin-container">
        <Sidebar />
        <div className="admin-main">
          <BookManagement />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Admin;
