import React from "react";
import "./ProductPage.css";
import Header from "../../components/Header/Header";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import ProductContainer from "./ProductDetails/ProductContainer";
import Section from "./Section/Section";
import Pagination from "./Pagination/Pagination";
import Comments from "./Comments/Comments";
import Footer from "../../components/Footer/Footer";
import BookSection from "../../components/BookSection/BookSection";
import ChatBot from "../../components/ChatBot/ChatBot";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProductPage() {
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const fetchBookById = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`http://localhost:8080/api/v1/books/${id}`);
      if (res.data) {
        setBook(res.data);
        // Fetch related books by author
        const relatedRes = await axios.get(
          `http://localhost:8080/api/v1/books?authorName=${res.data.authorName}&page=0&size=5`
        );
        if (relatedRes.data && Array.isArray(relatedRes.data.content)) {
          setRelatedBooks(
            relatedRes.data.content.filter((book) => book.id !== parseInt(id))
          );
        }
        // Fetch recommended books (latest books)
        const recommendedRes = await axios.get(
          "http://localhost:8080/api/v1/books?page=0&size=5"
        );
        if (recommendedRes.data && Array.isArray(recommendedRes.data.content)) {
          setRecommendedBooks(
            recommendedRes.data.content.filter(
              (book) => book.id !== parseInt(id)
            )
          );
        }
      }
    } catch (error) {
      console.error("Error fetching book:", error);
      navigate("/404");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCategory = async () => {
    const res = await axios.get(`http://localhost:8080/api/v1/categories`);
    setCategories(res.data.result.content);
    console.log(res.data);
  };

  useEffect(() => {
    fetchBookById();
    fetchCategory();
  }, [id]);
  console.log(categories);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Breadcrumb bookTitle={book?.title} />
        <ProductContainer book={book} />

        <Section
          className="introduction-section"
          title="Giới Thiệu Sách"
          content={
            <div className="intro-description">
              <p>{book.introduction || "Chưa có mô tả cho sách này."}</p>
            </div>
          }
        />

        <Section
          className="related-books-section"
          title="Sách Cùng Tác Giả"
          content={
            <BookSection
              title="Sách Cùng Tác Giả"
              books={relatedBooks}
              showPagination={false}
            />
          }
        />

        <Section
          title="Có Thể Bạn Quan Tâm"
          content={
            <BookSection
              title="Có Thể Bạn Quan Tâm"
              books={recommendedBooks}
              showPagination={false}
            />
          }
        />

        <Comments />
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}

export default ProductPage;
