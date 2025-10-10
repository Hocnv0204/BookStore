import React, { useState, useEffect } from "react";
import "./SearchResults.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import BookSection from "../../components/BookSection/BookSection";
import ChatBot from "../../components/ChatBot/ChatBot";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const PRICE_RANGES = [
  { label: "0đ - 150,000đ", min: 0, max: 150000 },
  { label: "150,000đ - 300,000đ", min: 150000, max: 300000 },
  { label: "300,000đ - 500,000đ", min: 300000, max: 500000 },
  { label: "500,000đ - 700,000đ", min: 500000, max: 700000 },
  { label: "700,000đ Trở Lên", min: 700000, max: Infinity },
];

function SearchResults() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // array of id
  const [checkedPriceRanges, setCheckedPriceRanges] = useState([]); // array of index
  const [customPrice, setCustomPrice] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/categories");
      setCategories(res.data.data.content);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch search results
  const fetchSearchResults = async () => {
    try {
      setIsLoading(true);

      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage,
        size: pageSize,
        sortBy: sortBy,
        sortOrder: sortOrder,
        keyword: keyword,
      });

      // Add category filter if selected
      if (selectedCategories.length > 0) {
        params.append("categoryId", selectedCategories[0]); // Currently supporting single category
      }

      // Add price range filter
      if (checkedPriceRanges.length > 0) {
        const range = PRICE_RANGES[checkedPriceRanges[0]]; // Currently supporting single range
        params.append("minPrice", range.min);
        params.append("maxPrice", range.max);
      } else if (customPrice.min || customPrice.max) {
        if (customPrice.min) params.append("minPrice", customPrice.min);
        if (customPrice.max) params.append("maxPrice", customPrice.max);
      }

      const url = `http://localhost:8080/api/books/search?${params.toString()}`;
      const res = await axios.get(url);

      setBooks(res.data.data.content);
      // Update pagination info from API response
      setCurrentPage(res.data.data.pageNumber);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSearchResults();
  }, [
    keyword,
    selectedCategories,
    checkedPriceRanges,
    customPrice,
    currentPage,
    sortBy,
    sortOrder,
  ]);

  // Filter books by selected categories and price ranges
  const filteredBooks = books;

  // Sort books ở FE
  const sortedBooks = filteredBooks.sort((a, b) => {
    let v1 = a[sortBy];
    let v2 = b[sortBy];
    if (sortBy === "title") {
      v1 = v1?.toLowerCase() || "";
      v2 = v2?.toLowerCase() || "";
    }
    if (v1 < v2) return sortOrder === "asc" ? -1 : 1;
    if (v1 > v2) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination trên filteredBooks
  const pagedBooks = sortedBooks.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Category checkbox
  const handleCategoryCheck = (id) => {
    setCurrentPage(0);
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // Price range checkbox
  const handlePriceCheck = (idx) => {
    setCurrentPage(0);
    setCheckedPriceRanges((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
    setCustomPrice({ min: "", max: "" }); // reset custom price khi chọn checkbox
  };

  // Custom price
  const handleCustomPriceChange = (e) => {
    setCurrentPage(0);
    setCheckedPriceRanges([]); // reset checkbox khi nhập custom
    setCustomPrice((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="search-results">
      <Header />
      <main className="main-content">
        <Breadcrumb categoryName={`Kết quả tìm kiếm cho "${keyword}"`} />
        <div className="search-filters-outer">
          <div className="search-filters-box">
            <h2 className="filter-title">LỌC THEO</h2>
            <div className="filter-group">
              <div className="filter-label">DANH MỤC CHÍNH</div>
              {categories.map((cat) => (
                <label key={cat.id} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => handleCategoryCheck(cat.id)}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
            <hr />
            <div className="filter-group">
              <div className="filter-label">GIÁ</div>
              {PRICE_RANGES.map((range, idx) => (
                <label key={range.label} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={checkedPriceRanges.includes(idx)}
                    onChange={() => handlePriceCheck(idx)}
                  />
                  <span>{range.label}</span>
                </label>
              ))}
              <div className="filter-custom-price-label">
                Hoặc chọn mức giá phù hợp
              </div>
              <div className="filter-custom-price-row">
                <input
                  type="number"
                  name="min"
                  placeholder="0"
                  value={customPrice.min}
                  onChange={handleCustomPriceChange}
                  className="filter-custom-price-input"
                  min={0}
                />
                <span>-</span>
                <input
                  type="number"
                  name="max"
                  placeholder="0"
                  value={customPrice.max}
                  onChange={handleCustomPriceChange}
                  className="filter-custom-price-input"
                  min={0}
                />
              </div>
            </div>
          </div>
          <div className="search-results-main">
            <div className="search-results-header">
              <h2>Kết quả tìm kiếm cho "{keyword}"</h2>
              <p>Tìm thấy {filteredBooks.length} kết quả</p>
              <div className="sort-bar">
                <label>
                  Sắp xếp:
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(0);
                    }}
                    className="sort-select"
                  >
                    <option value="title">Tên sách</option>
                    <option value="price">Giá</option>
                  </select>
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    setCurrentPage(0);
                  }}
                  className="sort-select"
                >
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </select>
              </div>
            </div>
            <BookSection
              books={pagedBooks}
              pageNumber={currentPage}
              totalPages={totalPages}
              totalElements={filteredBooks.length}
              pageSize={pageSize}
              last={currentPage === totalPages - 1}
              onPageChange={handlePageChange}
              showPagination={true}
            />
          </div>
        </div>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}

export default SearchResults;
