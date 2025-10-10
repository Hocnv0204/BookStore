import { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../../../components/Header/Header";
import Table from "../Table/Table";
import Footer from "../../../components/Footer/Footer";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import axios from "axios";
import "./Category.css";

function Category() {
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(0);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchCategories();
  }, [page, size, sortBy, sortOrder]);

  const fetchCategories = async (searchKeyword = keyword) => {
    try {
      const params = { page, size, sortBy, sortOrder };
      let url = "http://localhost:8080/api/categories";
      if (searchKeyword && searchKeyword.trim() !== "") {
        params.keyword = searchKeyword.trim();
        url = `http://localhost:8080/api/categories/search`;
      }
      const response = await axios.get(url, { params });
      console.log(response.data);
      // Nếu API trả về response.data.content
      const data = response.data.data.content || [];
      setCategories(data);
      setTotalPages(
        response.data.data.totalPages || response.data.result?.totalPages || 1
      );
      setTotalElements(
        response.data.data.totalElements ||
          response.data.result?.totalElements ||
          0
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = (newCategory) => {
    setCategories([newCategory, ...categories]);
  };
  const handleEditCategory = (updatedCategory) => {
    setCategories(
      categories.map((cat) =>
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    );
  };
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await axios.delete(
          `http://localhost:8080/api/categories/admin/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setCategories(categories.filter((cat) => cat.id !== categoryId));
        alert("Xóa danh mục thành công!");
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Lỗi khi xóa danh mục!");
      }
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchCategories(keyword);
  };

  const tableHeaders = ["Mã Danh Mục", "Tên Danh Mục", "Ảnh Danh Mục", ""];

  return (
    <div className="category">
      <Header />
      <div className="category-container">
        <Sidebar />
        <div className="category-main">
          <div className="content-header">
            <h2>Danh Sách Danh Mục</h2>
            <div className="content-actions">
              <div className="add-container">
                <button
                  className="add-category-btn"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <i className="fas fa-plus"></i>
                  Thêm danh mục
                </button>
              </div>
              <div className="category-search-container">
                <form
                  onSubmit={handleSearch}
                  style={{ display: "flex", gap: 8 }}
                >
                  <input
                    id="searchInput"
                    type="text"
                    placeholder="Tìm kiếm theo tên danh mục "
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <button type="submit" className="search-button">
                    <svg
                      class="icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="category-table-wrapper">
            <Table
              ContentTable={categories}
              HeaderTable={tableHeaders}
              type="category"
              onEdit={handleEdit}
              onDelete={handleDeleteCategory}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={size}
              currentPage={page}
              onPageChange={(newPage) => setPage(newPage)}
              onSort={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </div>
        </div>
      </div>
      <Footer />
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCategory}
      />
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={selectedCategory}
        onSave={handleEditCategory}
      />
    </div>
  );
}

export default Category;
