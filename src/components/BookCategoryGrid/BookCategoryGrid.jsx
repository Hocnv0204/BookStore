import "./BookCategoryGrid.css";

function BookCategoryGrid() {
  const categories = [
    {
      id: 1,
      title: "Văn Học Nước Ngoài",
      imageUrl: "https://via.placeholder.com/150x200",
    },
    {
      id: 2,
      title: "Sale Cuối Năm 2024",
      imageUrl: "https://via.placeholder.com/150x200",
    },
    {
      id: 3,
      title: "Truyện Tranh - Comic",
      imageUrl: "https://via.placeholder.com/150x200",
    },
    {
      id: 4,
      title: "Sách Văn Học",
      imageUrl: "https://via.placeholder.com/150x200",
    },
    {
      id: 5,
      title: "Truyện Tranh BL",
      imageUrl: "https://via.placeholder.com/150x200",
    },
    {
      id: 6,
      title: "Sách Kĩ Năng Sống",
      imageUrl: "https://via.placeholder.com/150x200",
    },
    {
      id: 7,
      title: "Light Novel",
      imageUrl: "https://via.placeholder.com/150x200",
    },
    {
      id: 8,
      title: "Sách Thiếu Nhi",
      imageUrl: "https://via.placeholder.com/150x200",
    },
    {
      id: 9,
      title: "Văn Phòng Phẩm - Quà",
      imageUrl: "https://via.placeholder.com/150x200",
    },
  ];

  return (
    <div className="category-grid">
      {categories.map((category) => (
        <a href="#" key={category.id} className="category-card">
          <div className="category-image-container">
            <img
              src={category.imageUrl || "/placeholder.svg"}
              alt={category.title}
              className="category-image"
            />
          </div>
          <span className="category-title">{category.title}</span>
        </a>
      ))}
    </div>
  );
}

export default BookCategoryGrid;
