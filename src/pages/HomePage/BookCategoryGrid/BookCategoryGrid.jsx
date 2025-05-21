import "./BookCategoryGrid.css";
// import { categories } from "../../../data/category";
import { Link } from "react-router-dom";
function BookCategoryGrid({ categories }) {
  const filteredCategories = categories.filter(
    (category) =>
      !["new-books", "best-seller-books", "coming-soon-books"].includes(
        category.name
      )
  );
  return (
    <div className="category-grid">
      {filteredCategories.map((category) => (
        <Link
          to={`/category/${category.id}`}
          className="category-card"
          key={category.id}
        >
          <div className="category-image-container">
            <img
              src={category.imageUrl}
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
