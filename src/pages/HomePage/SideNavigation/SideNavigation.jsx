import "./SideNavigation.css";

function SideNavigation() {
  const categories = [
    { id: 1, name: "Nổi bật", hasChildren: true },
    { id: 2, name: "Văn học nước ngoài", hasChildren: false },
    { id: 3, name: "Sale cuối năm 2022", hasChildren: false },
    { id: 4, name: "Truyện Tranh - Comic", hasChildren: false },
    { id: 5, name: "Sách Văn Học", hasChildren: true },
    { id: 6, name: "Truyện Tranh BL", hasChildren: false },
    { id: 7, name: "Sách Kĩ Năng Sống", hasChildren: false },
    { id: 8, name: "Light Novel", hasChildren: false },
    { id: 9, name: "Sách Thiếu Nhi", hasChildren: false },
    { id: 10, name: "Văn Phòng Phẩm - Quà Tặng", hasChildren: false },
    { id: 11, name: "Công ty phát hành", hasChildren: true },
  ];

  return (
    <div className="side-navigation">
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category.id} className="category-item">
            <a href="#" className="category-link">
              <span>{category.name}</span>
              {category.hasChildren && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideNavigation;
