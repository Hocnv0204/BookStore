import { useState, useEffect } from "react";
import EditBookModal from "../BookManagement/EditBookModal";
import EditCategoryModal from "../Category/EditCategoryModal";
import "./Table.css";
import Pagination from "../../../components/Pagination/Pagination";
import axios from "axios";
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog"; // ✅ Import ConfirmDialog
import React from "react";

function Table({
  ContentTable,
  HeaderTable,
  type,
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  last,
  onPageChange,
  onEdit,
  onDelete,
}) {
  const [objects, setObjects] = useState([]);
  const MAX_LENGTH = 50;
  const truncateText = (text) => {
    if (text === null || text === undefined) return "";
    if (typeof text === "number") return text.toString();
    if (typeof text !== "string") return String(text);
    if (text.length <= MAX_LENGTH) return text;
    return text.slice(0, MAX_LENGTH) + "...";
  };
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null); // Lưu ID của đối tượng cần xóa

  useEffect(() => {
    if (Array.isArray(ContentTable)) {
      setObjects(
        ContentTable.filter((obj) => obj !== undefined && obj !== null)
      );
    } else {
      setObjects([]);
      console.warn(
        "ContentTable không phải là một mảng hoặc không có giá trị."
      );
    }
  }, [ContentTable]);

  // Book modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  // Category modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const accessToken = localStorage.getItem("accessToken");

  const handleEditClick = (id) => {
    const objectToEdit = objects.find((obj) => obj && obj.id === id);
    if (type === "book") {
      setSelectedObject(objectToEdit);
      setIsModalOpen(true);
    } else if (type === "category") {
      setSelectedCategory(objectToEdit);
      setIsCategoryModalOpen(true);
    }
  };

  // ✅ Thay đổi handle delete để mở confirm dialog hoặc gọi props
  const handleDeleteClick = (id) => {
    if (type === "book") {
      setIdToDelete(id); // Lưu ID của sách cần xóa
      setIsConfirmDialogOpen(true); // Mở hộp thoại xác nhận
    } else if (type === "category" && typeof onDelete === "function") {
      onDelete(id);
    }
  };

  // ✅ Hàm mới: Xử lý khi người dùng xác nhận xóa (chỉ cho book)
  const handleConfirmDelete = async () => {
    setIsConfirmDialogOpen(false); // Đóng hộp thoại xác nhận ngay lập tức
    if (idToDelete === null) return; // Đảm bảo có ID để xóa

    try {
      const response = await axios.delete(
        `http://localhost:8080/admin/books/delete/${idToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 204 || response.status === 200) {
        setObjects((prevObjects) =>
          prevObjects.filter((obj) => obj && obj.id !== idToDelete)
        );
      } else {
        alert("Xóa sách không thành công. Mã trạng thái: " + response.status);
      }
    } catch (error) {
      console.error("Lỗi khi xóa sách:", error);
      if (error.response && error.response.status === 401) {
        alert("Bạn không có quyền xóa sách. Vui lòng đăng nhập lại.");
      } else if (error.response && error.response.status === 403) {
        alert("Bạn không có đủ quyền để thực hiện thao tác này.");
      } else if (error.response && error.response.status === 404) {
        alert("Không tìm thấy sách để xóa.");
      } else {
        alert("Đã xảy ra lỗi khi xóa sách.");
      }
    } finally {
      setIdToDelete(null); // Luôn reset ID cần xóa
    }
  };

  // ✅ Hàm mới: Xử lý khi người dùng hủy xóa
  const handleCancelDelete = () => {
    setIsConfirmDialogOpen(false); // Đóng hộp thoại xác nhận
    setIdToDelete(null); // Reset ID cần xóa
  };

  const handleSave = (updatedBook) => {
    console.log("Updated book received in Table.jsx handleSave:", updatedBook);
    if (!updatedBook || !updatedBook.id) {
      console.error(
        "Dữ liệu sách cập nhật không hợp lệ (thiếu ID):",
        updatedBook
      );
      setIsModalOpen(false);
      return;
    }

    setObjects((prevObjects) =>
      prevObjects.map((obj) => {
        if (!obj || !obj.id) {
          return obj;
        }
        return obj.id === updatedBook.id ? { ...obj, ...updatedBook } : obj;
      })
    );
    setIsModalOpen(false);
    setSelectedObject(null);
  };

  return (
    <div className="table-container">
      <div className="table-content">
        <table className="table">
          <thead>
            <tr>
              {HeaderTable.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {objects && Array.isArray(objects) && objects.length > 0 ? (
              objects.map((object) => (
                <tr key={object?.id || `row-${Math.random()}`}>
                  {object &&
                    Object.entries(object).map(([key, value], i) => (
                      <td key={i}>
                        {React.isValidElement(value) ? (
                          value
                        ) : typeof value === "string" &&
                          (key.toLowerCase().includes("image") ||
                            key.toLowerCase().includes("img")) ? (
                          <img
                            src={value}
                            alt="img"
                            style={{
                              maxWidth: 60,
                              maxHeight: 60,
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                          />
                        ) : typeof value === "number" ? (
                          value.toLocaleString()
                        ) : (
                          truncateText(value)
                        )}
                      </td>
                    ))}
                  {(type === "book" || type === "category") && (
                    <td className="actions-cell">
                      <div className="more-actions">
                        <button
                          onClick={() => handleEditClick(object?.id)}
                          className="edit-button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                          </svg>
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteClick(object?.id)}
                          className="del-button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                          </svg>
                          Xóa
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={
                    HeaderTable.length +
                    (type === "book" || type === "category" ? 1 : 0)
                  }
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Không có dữ liệu để hiển thị.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        pageNumber={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={pageSize}
        last={last}
        onPageChange={onPageChange}
      />
      {/* Book modal */}
      {type === "book" && selectedObject && (
        <EditBookModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedObject(null);
          }}
          book={selectedObject}
          onSave={handleSave}
        />
      )}
      {/* Category modal */}
      {type === "category" && selectedCategory && (
        <EditCategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => {
            setIsCategoryModalOpen(false);
            setSelectedCategory(null);
          }}
          category={selectedCategory}
          onSave={handleSave}
        />
      )}
      {/* ✅ Thêm Confirm Dialog */}
      {type === "book" && (
        <ConfirmDialog
          isOpen={isConfirmDialogOpen}
          message={`Bạn có chắc chắn muốn xóa sách có ID: ${
            idToDelete || ""
          } không? Thao tác này không thể hoàn tác!`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default Table;
