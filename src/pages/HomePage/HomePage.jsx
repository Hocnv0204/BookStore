import "./HomePage.css";
import Header from "../../components/Header/Header";
import SideNavigation from "./SideNavigation/SideNavigation";
import BookCategoryGrid from "./BookCategoryGrid/BookCategoryGrid";
import BookSection from "../../components/BookSection/BookSection";
import PopularSearches from "./PopularSearches/PopularSearches";
import Banner from "./Banner/Banner";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
// Sample data
const upcomingBooks = [
  {
    id: 1,
    title: "PAYBACK - Tập 3 (Bản Thường)",
    author: "samk",
    price: 159000,
    originalPrice: 199000,
    discount: 20,
    imageUrl: "https://via.placeholder.com/200x300",
  },
  {
    id: 2,
    title: "Sách - Tích Chiếu - Bạn Y (Bản Thường)",
    author: "Bạn Y",
    price: 179000,
    originalPrice: 199000,
    discount: 10,
    imageUrl: "https://via.placeholder.com/200x300",
  },
  {
    id: 3,
    title: "Sách - Tích Chiếu - Bạn Y (Bản Đặc Biệt)",
    author: "Bạn Y",
    price: 197000,
    originalPrice: 219000,
    discount: 10,
    imageUrl: "https://via.placeholder.com/200x300",
  },
  {
    id: 4,
    title: "Thi Đại Học Toàn Cầu - Tập 1 (Bản Thường)",
    author: "Môn Tổ Lý",
    price: 152000,
    originalPrice: 190000,
    discount: 20,
    imageUrl: "https://via.placeholder.com/200x300",
  },
  {
    id: 5,
    title: "Toán Cầu Tiến Hóa (Bản Thường)",
    author: "Bản Sơn Phú Trần",
    price: 159000,
    originalPrice: 199000,
    discount: 20,
    imageUrl: "https://via.placeholder.com/200x300",
  },
];

const bestSellerBooks = [
  {
    id: 6,
    title: "The Falling Merman - Tập 1 (Bản Đặc Biệt)",
    author: "Lâm Tiêm - Chủ bút RE-vender",
    price: 179000,
    originalPrice: 199000,
    discount: 10,
    imageUrl: "https://via.placeholder.com/200x300",
  },
  {
    id: 7,
    title: "The Falling Merman - Tập 1 (Bản Thường)",
    author: "Lâm Tiêm - Chủ bút RE-vender",
    price: 132000,
    originalPrice: 165000,
    discount: 20,
    imageUrl: "https://via.placeholder.com/200x300",
  },
  {
    id: 8,
    title: "Trọn Bộ Sát Phá Lang (3 Tập)",
    author: "Kiếm",
    price: 435000,
    originalPrice: 435000,
    discount: 0,
    imageUrl: "https://via.placeholder.com/200x300",
  },
  {
    id: 9,
    title: "Ma Đạo Tổ Sư - Bản Truyện Tranh - Tập 1",
    author: "Mặc Hương Đồng Khứu",
    price: 135000,
    originalPrice: 159000,
    discount: 15,
    imageUrl: "https://via.placeholder.com/200x300",
  },
  {
    id: 10,
    title: "Ma Đạo Tổ Sư - Bản Truyện Tranh - Tập 2",
    author: "Mặc Hương Đồng Khứu",
    price: 279000,
    originalPrice: 279000,
    discount: 0,
    imageUrl: "https://via.placeholder.com/200x300",
  },
];

const newBooks = [
  {
    id: 11,
    title: "Collect Book Camphongland 2025",
    author: "",
    price: 499000,
    originalPrice: 499000,
    discount: 0,
    imageUrl: "https://via.placeholder.com/200x300",
  },
  {
    id: 12,
    title: "Thiên Quan Tứ Phúc - Bản Hoạt Hình - Tập 1",
    author: "Mặc Hương Đồng Khứu",
    price: 143000,
    originalPrice: 179000,
    discount: 20,
    imageUrl: "https://via.placeholder.com/200x300",
  },
  {
    id: 13,
    title: "Thiên Quan Tứ Phúc - Bản Hoạt Hình - Tập 2",
    author: "Mặc Hương Đồng Khứu",
    price: 249000,
    originalPrice: 279000,
    discount: 11,
    imageUrl: "https://via.placeholder.com/200x300",
  },
  {
    id: 14,
    title: "VEIL - Tập 6 (Bản Thường)",
    author: "Kotteri",
    price: 99000,
    originalPrice: 119000,
    discount: 17,
    imageUrl: "https://via.placeholder.com/200x300",
  },
  {
    id: 15,
    title: "VEIL - Tập 6 (Bản Siêu Đặc Biệt)",
    author: "Kotteri",
    price: 558000,
    originalPrice: 558000,
    discount: 0,
    imageUrl: "https://via.placeholder.com/200x300",
  },
];

function HomePage() {
  return (
    <div className="app">
      <Header />

      <div className="main-container">
        <SideNavigation />

        <div className="main-content">
          <Banner />

          <div className="section">
            <Link to="/category/new" className="section-header">
              Sách Mới
            </Link>
            <BookSection books={newBooks} />
          </div>

          <div className="section">
            <Link to="/category/best-seller" className="section-header">
              Sách Bán Chạy
            </Link>
            <BookSection books={bestSellerBooks} />
          </div>

          <div className="section">
            <Link to="/category/upcoming-release" className="section-header">
              Sắp Phát Hành
            </Link>
            <BookSection books={upcomingBooks} />
          </div>

          <div className="section">
            <a href="#" className="section-header">
              Danh Mục
            </a>
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
