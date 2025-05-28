# Hướng dẫn Huấn luyện AI cho BookStore Chatbot

## Tổng quan

Tài liệu này hướng dẫn các phương pháp huấn luyện AI để trả lời chính xác hơn về database sách.

## 1. Cải thiện đã thực hiện

### 1.1 Enhanced Prompt Engineering

- Cải thiện cấu trúc prompt với vai trò rõ ràng
- Thêm các quy tắc nghiêm ngặt về việc sử dụng database
- Hướng dẫn cách format thông tin (giá tiền, số lượng)
- Thêm context về lịch sử chat

### 1.2 Thuật toán tìm kiếm thông minh

```java
// Tìm kiếm theo độ ưu tiên:
1. Tên sách (findByTitleContainingIgnoreCase)
2. Tác giả (findByAuthorNameContainingIgnoreCase)
3. Tổng hợp (findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase)
```

### 1.3 AI Training Service

- `AITrainingService`: Service chuyên về training AI
- Các ví dụ huấn luyện cụ thể
- Feedback system để cải thiện liên tục

## 2. API Endpoints mới

### 2.1 Enhanced Chatbot (Khuyến nghị)

```http
POST /api/chatbot/enhanced
Content-Type: application/json

{
  "prompt": "Sách Harry Potter giá bao nhiêu?",
  "sessionId": "test-001",
  "userId": 1
}
```

### 2.2 Training AI

```http
POST /api/chatbot/train
```

### 2.3 Xem hướng dẫn training

```http
GET /api/chatbot/training-guide
```

## 3. Các phương pháp huấn luyện

### 3.1 Prompt Engineering Nâng cao

- **Role Definition**: Định nghĩa rõ vai trò "BookStore AI Assistant"
- **Task Specification**: Nêu rõ nhiệm vụ cụ thể
- **Strict Rules**: Quy tắc nghiêm ngặt về việc sử dụng dữ liệu
- **Format Guidelines**: Hướng dẫn format output

### 3.2 Context Enhancement

```java
// Cải thiện context với:
- Lịch sử chat để hiểu ngữ cảnh
- Thông tin database được format rõ ràng
- Ví dụ cụ thể về cách trả lời
- Hướng dẫn xử lý edge cases
```

### 3.3 Training Examples

```
VÍ DỤ HUẤN LUYỆN:
KHÁCH: "Harry Potter giá bao nhiêu?"
AI: "Sách Harry Potter và Hòn đá Phù thủy của tác giả J.K. Rowling,
     giá 350.000 VND, hiện còn 15 cuốn. Bạn có muốn biết thêm về
     các tập khác trong series không ạ?"
```

### 3.4 Feedback Loop

- Ghi log các câu trả lời để phân tích
- Thu thập feedback từ người dùng
- Cải thiện dựa trên pattern lỗi

## 4. Cách sử dụng

### 4.1 Sử dụng Enhanced Chatbot

```bash
# Test với enhanced chatbot
curl -X POST http://localhost:8080/api/chatbot/enhanced \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Có sách lập trình Java không?",
    "sessionId": "test-session",
    "userId": 1
  }'
```

### 4.2 Training AI

```bash
# Chạy training với dữ liệu mẫu
curl -X POST http://localhost:8080/api/chatbot/train
```

## 5. Monitoring và Cải thiện

### 5.1 Log Analysis

- Kiểm tra logs của AI training feedback
- Phân tích các pattern lỗi thường gặp
- Cải thiện prompt dựa trên feedback

### 5.2 A/B Testing

- So sánh `/chatbot/ask` (cũ) vs `/chatbot/enhanced` (mới)
- Đo lường độ chính xác của câu trả lời
- Thu thập feedback từ người dùng

### 5.3 Continuous Learning

```java
// Có thể mở rộng trong tương lai:
- Lưu feedback vào database
- Machine learning để cải thiện prompt
- Auto-tuning parameters
```

## 6. Kết quả mong đợi

### 6.1 Cải thiện độ chính xác

- Giảm hallucination (bịa thông tin)
- Tăng độ chính xác thông tin giá, tác giả, số lượng
- Phản hồi nhất quán hơn

### 6.2 Trải nghiệm người dùng tốt hơn

- Câu trả lời tự nhiên, thân thiện
- Hiểu được ngữ cảnh cuộc trò chuyện
- Đề xuất sách phù hợp

### 6.3 Khả năng xử lý phức tạp

- Hiểu được các câu hỏi không rõ ràng
- Đưa ra câu hỏi clarifying khi cần
- Xử lý các tình huống edge cases

## 7. Troubleshooting

### 7.1 Lỗi API key

Đã fix trong `application.yml`:

```yaml
gemini:
  api-key: "AIzaSyCxiDbi7JbHV1SchJRrEx-5FgIz8dbScks"
```

### 7.2 Lỗi không tìm thấy sách

- Kiểm tra từ khóa search
- Kiểm tra dữ liệu trong database
- Xem log của `extractKeywords` method

### 7.3 Response không như mong đợi

- Kiểm tra prompt trong log
- Điều chỉnh temperature và top-p trong GeminiConfig
- Thêm ví dụ training cụ thể hơn
