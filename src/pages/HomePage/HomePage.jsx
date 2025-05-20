import "./HomePage.css";
import Header from "../../components/Header/Header";
import SideNavigation from "./SideNavigation/SideNavigation";
import BookCategoryGrid from "./BookCategoryGrid/BookCategoryGrid";
import BookSection from "../../components/BookSection/BookSection";
import PopularSearches from "./PopularSearches/PopularSearches";
import Banner from "./Banner/Banner";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { newBooks, bestSellerBooks, upcomingBooks } from "../../data/booksData";
import axios from "axios";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
// Sample data

function HomePage() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  const fetchBooks = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/books");
    setBooks(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/categories");
    setCategories(res.data);
    console.log(res);
  };

  const fetchUser = async () => {
    try {
      const decodedToken = jwtDecode(accessToken);
      const newUser = {
        username: decodedToken.sub,
        role: decodedToken.scope,
      };
      setUser(newUser);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchUser();
  }, []);

  return (
    <div className="home-page">
      <Header />

      <div className="home-main-container">
        <SideNavigation />

        <div className="home-main-content">
          <Banner />

          <div className="section">
            <Link to="/category/new-books" className="section-header">
              Sách Mới
            </Link>
            <BookSection books={newBooks} />
          </div>

          <div className="section">
            <Link to="/category/best-seller-books" className="section-header">
              Sách Bán Chạy
            </Link>
            <BookSection books={bestSellerBooks} />
          </div>

          <div className="section">
            <Link to="/category/coming-soon-books" className="section-header">
              Sắp Phát Hành
            </Link>
            <BookSection books={upcomingBooks} />
          </div>

          <div className="section">
            <Link
              to="#"
              className="section-header"
              onClick={() => window.scrollTo(0, 0)}
            >
              <span>Danh Mục</span>
            </Link>
            <BookCategoryGrid />
          </div>

          <div className="section">
            <div className="section-header">
              <span>Thường Được Tìm Kiếm</span>
            </div>
            <PopularSearches />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
