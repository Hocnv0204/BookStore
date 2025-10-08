import "./SideNavigation.css";
import { Link } from "react-router-dom";
function SideNavigation({ categories }) {
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
            <li key={category.id} className="category-item">
              <Link to={`/category/${category.id}`} className="category-link">
                <span>{category.name}</span>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default SideNavigation;
