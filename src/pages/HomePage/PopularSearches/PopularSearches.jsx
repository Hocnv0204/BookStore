import "./PopularSearches.css";

function PopularSearches() {
  const searches = [
    [
      "truyện dan brown",
      "sách hay về gia đình",
      "sách học tiếng trung",
      "sách blockchain",
      "sách khởi nghiệp",
    ],
    [
      "sách warren buffett",
      "giáo trình tiếng anh kèm en",
      "tiểu thuyết tình yêu",
      "sách du học",
      "sách bán hàng",
    ],
    [
      "sách digital marketing",
      "sách hay về kinh tế",
      "sách y học",
      "sách lý năng mềm",
      "sách về đầu tư chứng khoán",
    ],
    [
      "truyện mới của nguyễn nhật ánh",
      "sách về đầu tư",
      "tủ sách gia đình",
      "sách làm giàu",
      "sách dạy nấu ăn",
    ],
  ];

  return (
    <div className="popular-searches">
      <div className="search-columns">
        {searches.map((column, columnIndex) => (
          <div key={columnIndex} className="search-column">
            {column.map((search, searchIndex) => (
              <a
                href="#"
                key={`${columnIndex}-${searchIndex}`}
                className="search-link"
              >
                {search}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularSearches;
