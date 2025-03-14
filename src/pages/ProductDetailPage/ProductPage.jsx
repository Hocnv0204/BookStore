import React from "react";
import "./ProductPage.css";
import Header from "../../components/Header/Header";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import ProductContainer from "./ProductDetails/ProductContainer";
import Section from "./Section/Section";
import BookGrid from "./BookCard/BookCard";
import Pagination from "./Pagination/Pagination";
import Comments from "./Comments/Comments";
import CartSummary from "./CartSummary/CartSummary";
import Footer from "../../components/Footer/Footer";

function ProductPage() {
  // Sample book data for related books
  const relatedBooks = [1, 2, 3, 4, 5].map((item) => ({
    id: item,
    title: "Thiên Quan Tứ Phúc - Bản Hoạt Hình Màu",
    price: item * 50000,
    originalPrice: item % 2 === 0 ? item * 60000 : null,
    discount: item % 2 === 0 ? "-20%" : null,
    image: `https://via.placeholder.com/150x200`,
  }));

  const recommendedBooks = [1, 2, 3, 4, 5].map((item) => ({
    id: item,
    title:
      item % 3 === 0
        ? "Collect Book Camphong/end 2025"
        : "Thiên Quan Tứ Phúc - Tập 1",
    price: item * 45000,
    originalPrice: item % 2 === 1 ? item * 55000 : null,
    discount: item % 2 === 1 ? "-15%" : null,
    image: `https://via.placeholder.com/150x200`,
  }));

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
      <Breadcrumb
        links={[
          { text: "Trang chủ", url: "/", isActive: false },
          { text: "Văn Sách Tiếng Việt", url: "/van-sach", isActive: false },
          { text: "Collect Book Camphong/end 2025", url: "#", isActive: true },
        ]}
      />

      <main className="main-content">
        <ProductContainer
          title="Collect Book Camphong/end 2025"
          author="Phạm Công Tự,Chí Phèo"
          price="499.000"
          image="https://via.placeholder.com/400"
        />

        <Section
          title="Giới Thiệu Sách"
          content={
            <div className="description">
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
          title="Thông Tin Tác Giả"
          content={
            <div className="description">
              <p>
                Jordan Peterson là nhà tâm lý học người Canada, nhà phê bình văn
                hóa và giáo sư tâm lý học tại Đại học Toronto. Ông được biết đến
                như một tác giả, diễn giả và người sáng lập ra chủ nghĩa cá thể
                hóc búa.
              </p>
            </div>
          }
        />

        <Section
          title="Thông Tin Chi Tiết"
          content={
            <div className="details-grid">
              {bookDetails.map((detail, index) => (
                <React.Fragment key={index}>
                  <div className="details-label">{detail.label}</div>
                  <div className="details-value">{detail.value}</div>
                </React.Fragment>
              ))}
            </div>
          }
        />

        <div className="buy-button-container">
          <button className="buy-button">Mua ngay</button>
        </div>

        <Section
          title="Sách Cùng Tác Giả"
          content={<BookGrid books={relatedBooks} />}
        />

        <Section
          title="Có Thể Bạn Quan Tâm"
          content={<BookGrid books={recommendedBooks} />}
        />

        <Pagination />
        <Comments />
      </main>

      <CartSummary />
      <Footer />
    </div>
  );
}

export default ProductPage;
