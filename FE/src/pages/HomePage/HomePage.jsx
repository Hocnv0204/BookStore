import "./HomePage.css";
import Header from "../../components/Header/Header";
import SideNavigation from "./SideNavigation/SideNavigation";
import BookCategoryGrid from "./BookCategoryGrid/BookCategoryGrid";
import HomePageBookSection from "./HomePageBookSection/HomePageBookSection";
import PopularSearches from "./PopularSearches/PopularSearches";
import Banner from "./Banner/Banner";
import Footer from "../../components/Footer/Footer";
import ChatBot from "../../components/ChatBot/ChatBot";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [categorizedBooks, setCategorizedBooks] = useState({});
  const fetchBookByCategory = useCallback(async (categoryId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/books/category/${categoryId}`
      );

      const booksArray = res.data.content || [];

      setCategorizedBooks((prevBooks) => ({
        ...prevBooks,
        [categoryId]: booksArray,
      }));
      console.log(`Books for category ${categoryId}:`, res.data); // Giữ log gốc để xem toàn bộ response
      console.log(`Actual books array for category ${categoryId}:`, booksArray); // Thêm log để xem mảng sách thực tế
    } catch (error) {
      console.error(`Lỗi khi lấy sách danh mục ${categoryId}:`, error);
    }
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/categories");
    setCategories(res.data.result.content);
    console.log(res.data.result.content);
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    categories.forEach((cat) => {
      fetchBookByCategory(cat.id);
    });
  }, [categories, fetchBookByCategory]);

  return (
    <div className="home-page">
      <Header />

      <div className="home-main-container">
        <SideNavigation categories={categories} />

        <div className="home-main-content">
          <Banner />

          <div className="section">
            <Link to="/category/22" className="section-header">
              Sách Văn Học Nước Ngoài
            </Link>
            <HomePageBookSection books={categorizedBooks[22]} />
          </div>

          <div className="section">
            <Link to="/category/17" className="section-header">
              Sách Kinh doanh
            </Link>
            <HomePageBookSection books={categorizedBooks[17]} />
          </div>

          <div className="section">
            <Link to="/category/19" className="section-header">
              Sách Kỹ Năng
            </Link>
            <HomePageBookSection books={categorizedBooks[19]} />
          </div>

          <div className="section">
            <Link
              to="#"
              className="section-header"
              onClick={() => window.scrollTo(0, 0)}
            >
              <span>Danh Mục</span>
            </Link>
            <BookCategoryGrid categories={categories} />
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
      <ChatBot />
    </div>
  );
}

export default HomePage;
