# Stationery E-commerce Platform

## Introduction
Nền tảng thương mại điện tử cho sản phẩm văn phòng phẩm, cung cấp giao diện hiện đại, thân thiện để khách hàng duyệt và mua hàng; đồng thời hỗ trợ quản trị viên quản lý kho, đơn hàng và tài khoản người dùng.

## Demo
![Alt text](image/img.png)

![Alt text](image/img1.png)

![Alt text](image/img2.png)

![Alt text](image/img3.png)

![Alt text](image/img4.png)

## Technology Stack

### Backend
- Spring Boot 3 (Java 17)
- Maven
- Spring Security (JWT)
- Spring Data JPA (MySQL)
- MapStruct, Lombok
- Mail + Thymeleaf Template
- Cloudinary integration
- VNPay integration
- Gemini integration

### Frontend
- ReactJS (Create React App)
- React Router
- MUI (Material UI)
- Chart.js

### Database
- MySQL 8

### Authentication
- JWT

### External
- VNPay
- Gemini

## Project Structure
```
├── bookstore-backend/
│   ├── src/
│   │   ├── main/java/com/bookstore/backend/
│   │   │   ├── controller/      # REST controllers (Auth, Book, Cart, ...)
│   │   │   ├── service/         # Services và impl/* (Payment, Gemini, ...)
│   │   │   ├── repository/      # Spring Data JPA repositories
│   │   │   ├── model/           # Entities
│   │   │   ├── dto/             # DTO, request/response
│   │   │   ├── mapper/          # MapStruct mappers
│   │   │   └── configuration/   # Security, Cloudinary, VNPay, Gemini, WebConfig
│   │   └── main/resources/
│   │       ├── application.yml
│   │       └── application.properties
│   └── pom.xml
│
└── FE/
    ├── src/                      # pages/, components/, assets/...
    ├── public/
    └── package.json
```

## Getting Started

### Prerequisites
- Java 17, Maven 3.8+
- Node.js 18+, npm 9+
- MySQL 8 (hoặc Docker)

### Backend
1) Cấu hình MySQL (tùy chọn dùng Docker Compose tại `bookstore-backend/docker-compose.yml`):
```bash
cd bookstore-backend
docker compose up -d
```
2) Cập nhật cấu hình trong `src/main/resources/application.yml` nếu cần (DB URL, tài khoản, JWT, Cloudinary, VNPay, Gemini).
3) Chạy ứng dụng:
```bash
mvn spring-boot:run
# API: http://localhost:8080/api/v1
```

### Frontend
1) Cài đặt phụ thuộc:
```bash
cd FE
npm install
```
2) Tạo file `.env` với biến (Create React App yêu cầu prefix `REACT_APP_`):
```
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
```
3) Chạy ứng dụng:
```bash
npm start
# Web: http://localhost:3000
```

## Contributing
1. Fork repository
2. Tạo nhánh tính năng (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push nhánh (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

