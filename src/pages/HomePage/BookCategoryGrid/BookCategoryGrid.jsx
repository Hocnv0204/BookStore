import "./BookCategoryGrid.css";
import { categories } from "../../../data/category";
import { Link } from "react-router-dom";
function BookCategoryGrid() {
  return (
    <div className="category-grid">
      {categories
        .filter(
          (category) =>
            category.title !== "new-books" &&
            category.title !== "best-seller-books" &&
            category.title !== "coming-soon-books"
        )
        .map((category) => (
          <Link
            to={`/category/${category.title}`}
            className="category-card"
            key={category.title}
          >
            <div className="category-image-container">
              <img
                src={category.image}
                alt={category.name}
                className="category-image"
              />
            </div>
            <span>{category.name}</span>
          </Link>
        ))}
    </div>
  );
}

export default BookCategoryGrid;
