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
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/categories"
      );
      setCategories(response.data.result.content);
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
          `http://localhost:8080/admin/categories/${categoryId}`,
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

  const filteredCategories = categories
    .filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = a.name.localeCompare(b.name);
      else if (sortBy === "id") cmp = a.id - b.id;
      else if (sortBy === "description")
        cmp = (a.description || "").localeCompare(b.description || "");
      return sortOrder === "asc" ? cmp : -cmp;
    });

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
                <input
                  id="searchInput"
                  type="text"
                  placeholder="Tìm kiếm theo tên danh mục..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="category-sort-container">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Sắp xếp theo tên</option>
                  <option value="id">Sắp xếp theo mã</option>
                  <option value="description">Sắp xếp theo mô tả</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </select>
              </div>
            </div>
          </div>
          <div className="category-table-wrapper">
            <Table
              ContentTable={filteredCategories}
              HeaderTable={tableHeaders}
              type="category"
              onEdit={handleEdit}
              onDelete={handleDeleteCategory}
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
