import React from "react";
import "./CategoryDetail.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import BookSection from "../../components/BookSection/BookSection";
import { booksData } from "../../data/booksData";
import ProductsHeader from "./ProductsHeader/ProductsHeader";
import { categories } from "../../data/category";
import { useParams } from "react-router-dom";
function CategoryDetail() {
  const { title } = useParams(); // Lấy title từ URL
  const category = categories.find((item) => item.title === title);

  const booksCategory = booksData.filter(
    (book) => book.category.toLowerCase === category.name.toLowerCase
  );
  return (
    <div className="category-detail">
      <Header />

      <main className="main-content">
        <Breadcrumb
          categoryName={category.name}
          categoryTitle={category.title}
        />

        <ProductsHeader title={category.name} />

        <BookSection books={booksCategory} />

        <Footer />
      </main>
    </div>
  );
}

export default CategoryDetail;
