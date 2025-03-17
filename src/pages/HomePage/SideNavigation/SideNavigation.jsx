import "./SideNavigation.css";
import { Link } from "react-router-dom";
import { categories } from "../../../data/category";
function SideNavigation() {
  return (
    <div className="side-navigation">
      <ul className="category-list">
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
              key={category.title}
              className="category-link"
            >
              <li key={category.id} className="category-item">
                <span>{category.name}</span>
              </li>
            </Link>
          ))}
      </ul>
    </div>
  );
}

export default SideNavigation;
