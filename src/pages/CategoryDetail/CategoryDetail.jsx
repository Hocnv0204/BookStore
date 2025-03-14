import React from "react";
import "./CategoryDetail.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import BookSection from "../../components/BookSection/BookSection";
import Pagination from "./Pagination/Pagination";
import { booksData } from "./booksData";
import ProductsHeader from "./ProductsHeader/ProductsHeader";

function CategoryDetail() {
  return (
    <div className="category-detail">
      <Header />

      <main className="main-content">
        <Breadcrumb
          paths={[
            { name: "Nobita.vn", url: "/" },
            { name: "Nhà Sách Trên Mạng", url: "/nha-sach" },
            { name: "Sách mới", url: "/sach-moi" },
          ]}
        />

        <ProductsHeader title="Sách mới" />

        <BookSection books={booksData} />

        <Pagination totalPages={27} currentPage={1} />
        <Footer />
      </main>
    </div>
  );
}

export default CategoryDetail;
