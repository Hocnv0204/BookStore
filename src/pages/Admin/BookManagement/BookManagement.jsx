import Table from "../Table/Table";
import "./BookManagement.css";
import { useState } from "react";
import AddBookModal from "./AddBookModal";
const sampleBooks = [
  {
    id: "8935256707640",
    title: "Sword Art Online Progressive Vol 7",
    publisher: "IPM, Hà Nội",
    author: "REKI KAWAHARA",
    price: 120000,
    description: "Đã..",
    quantity: 10,
    // image:
    //   "https://nobita.vn/wp-content/uploads/placeholder/sword-art-online-progressive-vol7.jpg",
  },
  {
    id: "8935256707641",
    title: "Sword Art Online Progressive Vol 8",
    publisher: "IPM, Hà Nội",
    author: "REKI KAWAHARA",
    price: 125000,
    description: "Đã thấy Sword  th...",
    quantity: 5,
    // image:
    //   "https://nobita.vn/wp-content/uploads/placeholder/sword-art-online-progressive-vol8.jpg",
  },
  {
    id: "8935256707642",
    title: "Sword Art Online Progressive Vol 9",
    publisher: "IPM, Hà Nội",
    author: "REKI KAWAHARA",
    price: 130000,
    description:
      "Đã thấy Sword Art Online có không gian kệ chuyển rất rộng, lại tì mì đi th...",
    quantity: 7,
    // image:
    //   "https://nobita.vn/wp-content/uploads/placeholder/sword-art-online-progressive-vol9.jpg",
  },
  {
    id: "8935256707643",
    title: "Attack on Titan Vol 1",
    publisher: "Kodansha",
    author: "Hajime Isayama",
    price: 110000,
    description:
      "Một thế giới nơi loài người chiến đấu chống lại Titan khổng lồ...",
    quantity: 15,
    // image:
    //   "https://nobita.vn/wp-content/uploads/placeholder/attack-on-titan-vol1.jpg",
  },
  {
    id: "8935256707644",
    title: "Attack on Titan Vol 2",
    publisher: "Kodansha",
    author: "Hajime Isayama",
    price: 115000,
    description: "Sự thật về bức tường và Titan dần được hé lộ...",
    quantity: 12,
    // image:
    //   "https://nobita.vn/wp-content/uploads/placeholder/attack-on-titan-vol2.jpg",
  },
  {
    id: "8935256707645",
    title: "One Piece Vol 1",
    publisher: "Shueisha",
    author: "Eiichiro Oda",
    price: 95000,
    description: "Cuộc hành trình của Luffy và đồng đội bắt đầu...",
    quantity: 20,
    // image:
    //   "https://nobita.vn/wp-content/uploads/placeholder/one-piece-vol1.jpg",
  },
  {
    id: "8935256707646",
    title: "One Piece Vol 2",
    author: "Eiichiro Oda",
    publisher: "Shueisha",
    price: 100000,
    quantity: 18,
    description: "Luffy gặp Zoro và bắt đầu thành lập băng hải tặc Mũ Rơm...",
    // image:
    //   "https://nobita.vn/wp-content/uploads/placeholder/one-piece-vol2.jpg",
  },
  {
    id: "8935256707647",
    title: "Tokyo Revengers Vol 1",
    author: "Ken Wakui",
    publisher: "Kodansha",
    price: 105000,
    quantity: 10,
    description: "Takemichi quay về quá khứ để cứu bạn gái của mình...",
    // image:
    //   "https://nobita.vn/wp-content/uploads/placeholder/tokyo-revengers-vol1.jpg",
  },
  {
    id: "8935256707648",
    title: "Demon Slayer: Kimetsu no Yaiba Vol 1",
    author: "Koyoharu Gotouge",
    publisher: "Shueisha",
    price: 98000,
    quantity: 14,
    description: "Cuộc hành trình diệt quỷ của Tanjiro bắt đầu...",
    // image:
    //   "https://nobita.vn/wp-content/uploads/placeholder/demon-slayer-vol1.jpg",
  },
  {
    id: "8935256707649",
    title: "Demon Slayer: Kimetsu no Yaiba Vol 2",
    author: "Koyoharu Gotouge",
    publisher: "Shueisha",
    price: 102000,
    quantity: 8,
    description: "Tanjiro gặp Zenitsu và Inosuke trong hành trình diệt quỷ...",
    // image:
    //   "https://nobita.vn/wp-content/uploads/placeholder/demon-slayer-vol2.jpg",
  },
];
const HeaderTable = [
  "Mã Sách",
  "Tên Sách",
  "Nhà Xuất Bản",
  "Tác Giả",
  "Giá",
  "Mô tả",
  "Tồn Kho",
  "",
];
function BookManagement() {
  const [showModal, setShowModal] = useState(false);
  // const
  return (
    <div className="book-management">
      <div className="book-management-main">
        <div className="content-header">
          <h2>Danh Sách Sách</h2>
          <div className="content-actions">
            <div className="add-container">
              <button className="add-btn" onClick={() => setShowModal(true)}>
                <i className="fas fa-plus"></i>
                Thêm sách
              </button>
            </div>
            <div class="book-management-search-container">
              <input
                type="text"
                id="searchInput"
                placeholder="Tìm kiếm theo mã sách..."
                onkeyup="searchBook()"
              />
            </div>
          </div>
        </div>
        <Table
          ContentTable={sampleBooks}
          HeaderTable={HeaderTable}
          type="book"
        />
      </div>
      <div className="book-management-modal">
        {showModal && (
          <AddBookModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default BookManagement;
