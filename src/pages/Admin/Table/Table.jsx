// import { useState } from "react";
// import "./Table.css";
// import EditBookModal from "../BookManagement/EditBookModal";
// function Table({ ContentTable, HeaderTable, type }) {
//   const [objects, setObjects] = useState(ContentTable);
//   const [showModal, setShowModal] = useState(false);

//   const handleDeleteClick = (id) => {
//     setObjects(objects.filter((object) => object.id !== id));
//   };

//   return (
//     <div className="table-container">
//       <div className="table-content">
//         <table className="table">
//           <thead>
//             <tr>
//               {HeaderTable.map((header, index) => (
//                 <th key={index}>{header}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {objects.map((object, index) => (
//               <tr key={index}>
//                 {Object.values(object).map((value, i) => (
//                   <td key={i}>
//                     {typeof value === "number" ? value.toLocaleString() : value}
//                   </td>
//                 ))}
//                 {type === "book" && (
//                   <td className="actions-cell">
//                     <div className="more-actions">
//                       <button
//                         onClick={() => setShowModal(true)}
//                         className="edit-button"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 512 512"
//                         >
//                           <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
//                         </svg>
//                         Sửa
//                       </button>
//                       <button
//                         onClick={() => handleDeleteClick(object.id)}
//                         className="del-button"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 448 512"
//                         >
//                           <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
//                         </svg>
//                         Xóa
//                       </button>
//                     </div>
//                   </td>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {showModal && (
//         <EditBookModal
//           isOpen={showModal}
//           onClose={() => setShowModal(false)}
//           book={objects.find((object) => object.id === showModal)}
//         />
//       )}
//     </div>
//   );
// }

// export default Table;
import { useState } from "react";
import EditBookModal from "../BookManagement/EditBookModal"; // Import EditBookModal
import "./Table.css";

function Table({ ContentTable, HeaderTable, type }) {
  const [objects, setObjects] = useState(ContentTable);
  const [isModalOpen, setIsModalOpen] = useState(false); // State để điều khiển modal
  const [selectedObject, setSelectedObject] = useState(null); // State để lưu object được chọn

  const handleEditClick = (id) => {
    const objectToEdit = objects.find((obj) => obj.id === id);
    setSelectedObject(objectToEdit); // Lưu object để truyền vào modal
    setIsModalOpen(true); // Mở modal
  };

  const handleDeleteClick = (id) => {
    setObjects(objects.filter((obj) => obj.id !== id));
  };

  const handleSave = (updatedBook) => {
    setObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === updatedBook.id ? { ...obj, ...updatedBook } : obj
      )
    );
    setIsModalOpen(false);
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
            {objects.map((object) => (
              <tr key={object.id}>
                {Object.values(object).map((value, i) => (
                  <td key={i}>
                    {typeof value === "number" ? value.toLocaleString() : value}
                  </td>
                ))}
                {type === "book" && (
                  <td className="actions-cell">
                    <div className="more-actions">
                      <button
                        onClick={() => handleEditClick(object.id)}
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
                        onClick={() => handleDeleteClick(object.id)}
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
            ))}
          </tbody>
        </table>
      </div>

      {selectedObject && (
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
    </div>
  );
}

export default Table;
