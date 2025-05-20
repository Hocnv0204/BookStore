import "./TopSellingBooksList.css";

export default function TopSellingBooksList() {
  const products = [
    {
      id: 1,
      name: "Đắc Nhân Tâm",
      author: "Dale Carnegie",
      sold: "1,250 đã bán",
    },
    {
      id: 2,
      name: "Nhà Giả Kim",
      author: "Paulo Coelho",
      sold: "980 đã bán",
    },
    {
      id: 3,
      name: "Muôn Kiếp Nhân Sinh",
      author: "Nguyễn Phong",
      sold: "750 đã bán",
    },
  ];

  return (
    <div className="products-card">
      <div className="products-content">
        <h2 className="products-title">Sản phẩm bán chạy</h2>
        <div className="products-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <div className="product-rank">
                <span>{product.id}</span>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-author">{product.author}</p>
              </div>
              <div className="product-sales">
                <p>{product.sold}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
