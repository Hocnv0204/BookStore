import React from "react";
import "./CategoryDetail.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import BookSection from "../../components/BookSection/BookSection";
import ProductsHeader from "./ProductsHeader/ProductsHeader";
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function CategoryDetail() {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [categorizedBooks, setCategorizedBooks] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [last, setLast] = useState(true);

  const fetchBookByCategory = useCallback(async (categoryId, page = 0) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/books/category/${categoryId}?page=${page}&size=5`
      );

      const booksArray = res.data.content || [];
      const totalPages = res.data.totalPages || 1;
      const totalElements = res.data.totalElements || 0;
      const pageSize = res.data.size || 5;
      const last = res.data.last ?? true;

      setCategorizedBooks((prevBooks) => ({
        ...prevBooks,
        [categoryId]: booksArray,
      }));
      setTotalPages(totalPages);
      setTotalElements(totalElements);
      setPageSize(pageSize);
      setLast(last);
    } catch (error) {
      console.error(`Lỗi khi lấy sách danh mục ${categoryId}:`, error);
    }
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchBookByCategory(id, newPage);
  };

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:8080/api/v1/categories");
      setCategories(res.data.result.content);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchBookByCategory(id, currentPage);
    }
  }, [categories, id, currentPage, fetchBookByCategory]);

  const category = categories.find((item) => item.id === parseInt(id));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!category) {
    return <div>Category not found</div>;
  }
  console.log(categorizedBooks[id]);
  return (
    <div className="category-detail">
      <Header />

      <main className="main-content">
        <Breadcrumb
          categoryName={category.name}
          categoryId={category.id}
          category={category}
        />

        <ProductsHeader title={category.name} />

        <BookSection
          books={categorizedBooks[id]}
          pageNumber={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          last={last}
          onPageChange={handlePageChange}
          showPagination={true}
        />

        <Footer />
      </main>
    </div>
  );
}

export default CategoryDetail;
