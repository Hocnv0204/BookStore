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
import { booksData } from "../../data/booksData";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
function ProductPage() {
  // Sample book data for related books

  const { id } = useParams();
  const book = booksData.find((book) => book.id === Number(id));
  const Author = book.author;
  const relatedBooks = booksData
    .filter((book) => book.author === Author && book.id !== Number(id))
    .slice(0, 5);
  const recommendedBooks = booksData
    .slice(0, 5)
    .filter((book) => book.id !== Number(id));
  // Book details data
  const bookDetails = [
    { label: "Mã hàng:", value: "8935235789876" },
    { label: "Nhà xuất bản:", value: "Nhà Xuất Bản Phương Nam" },
    { label: "Tác giả:", value: "Jordan B. Peterson" },
    { label: "Người dịch:", value: "Trí Nguyễn" },
    { label: "NXB:", value: "Lao Động" },
    { label: "Năm XB:", value: "2023" },
    { label: "Ngôn ngữ:", value: "Tiếng Việt" },
    { label: "Trọng lượng (gr):", value: "540" },
    { label: "Kích thước bao bì:", value: "20.5 x 13 x 2.8 cm" },
    { label: "Số trang:", value: "450" },
    { label: "Hình thức:", value: "Bìa Mềm" },
  ];

  return (
    <div className="app-container">
      <Header />
      <Breadcrumb categoryName={book.category} bookTitle={book.title} />

      <main className="main-content">
        <ProductContainer
          title={book.title}
          image={book.image}
          price={book.price}
          author={book.author}
        />

        <Section
          className="introduction-section"
          title="Giới Thiệu Sách"
          content={
            <div className="intro-description">
              <p>
                Cuộc sống hiện nay ở thời Collect book trong một thế giới Phong
                cách 2025 như thế nào? Hãy khám phá ngay!
              </p>
              <p>- Chất liệu và nguồn gốc PVC</p>
              <p>- Bộ khiên bảo trọng 39 Mảnh Khảo 2 mặt, bộ đủ 21 card</p>
              <p>- Sách Tiếng Việt</p>
              <p>- Kích thước: cho size card: 6.5cm</p>
              <p>- Hàng Nhật Bản, Namthan</p>
            </div>
          }
        />

        <Section
          className="details-section"
          title="Thông Tin Chi Tiết"
          content={
            <table className="details-table">
              <tbody>
                {bookDetails.map((detail, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "even-row" : "odd-row"}
                  >
                    <td className="details-label">{detail.label}</td>
                    <td className="details-value">{detail.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        />
        <Link to="/cart">
          <div className="buy-button-container">
            <button className="buy-button">Mua ngay</button>
          </div>
        </Link>
        <Section
          className="related-books-section"
          title="Sách Cùng Tác Giả"
          content={
            <BookSection title="Sách Cùng Tác Giả" books={relatedBooks} />
          }
        />

        <Section
          title="Có Thể Bạn Quan Tâm"
          content={
            <BookSection title="Có Thể Bạn Quan Tâm" books={recommendedBooks} />
          }
        />

        {/* <Pagination /> */}
        <Comments />
      </main>

      <Footer />
    </div>
  );
}

export default ProductPage;
