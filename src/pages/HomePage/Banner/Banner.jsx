import "./Banner.css";
import { useState, useEffect } from "react";

function Banner() {
  // Danh sách các banner
  const banners = [
    {
      src: "https://cdn1.fahasa.com/media/magentothem/banner7/MCBooksT3_KC_840x320.png",
      alt: "Banner Văn Học Lịch Sử",
    },
    {
      src: "https://cdn1.fahasa.com/media/magentothem/banner7/saigonbooks_bac_840x320_1.png",
      alt: "Banner Văn Học Nước Ngoài - 1984",
    },
    {
      src: "https://cdn1.fahasa.com/media/magentothem/banner7/hoisacht3_840x320_2.jpg",
      alt: "Banner Truyện Tranh - Doraemon",
    },
    {
      src: "https://cdn1.fahasa.com/media/magentothem/banner7/muasamkhongtienmatT325_840x320.png",
      alt: "Banner Sale - Harry Potter",
    },
    {
      src: "https://cdn1.fahasa.com/media/magentothem/banner7/CanhCutThanToc_840x320.png",
      alt: "Banner BL - Thiên Quan Tứ Phúc",
    },
  ];

  // Trạng thái để theo dõi banner hiện tại
  const [currentBanner, setCurrentBanner] = useState(0);

  // Tự động chuyển banner sau mỗi 1 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 10000); // 1000ms = 1 giây

    return () => clearInterval(interval); // Dọn dẹp interval
  }, [banners.length]); // Thêm banners.length vào dependency để đảm bảo tính đúng đắn

  // Hàm xử lý khi nhấp vào dấu chấm
  const handleDotClick = (index) => {
    setCurrentBanner(index);
  };

  return (
    <div className="banner">
      <a href="#">
        <img
          src={banners[currentBanner].src}
          alt={banners[currentBanner].alt}
          className="banner-image"
        />
      </a>
      {/* Dấu chấm điều hướng */}
      <div className="dots-container">
        {banners.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentBanner === index ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default Banner;
