# CHATBOT DATABASE DEMO - Cải tiến với Anti-Hallucination

## Mô tả

Chatbot AI được tích hợp với database để trả lời câu hỏi về sách trong cửa hàng BookStore.
**Điểm mạnh**: Chatbot chỉ trả lời dựa trên dữ liệu thực tế có trong database và không tự bịa thông tin.

## Tính năng chính được cải tiến

### 1. Anti-Hallucination System

- **Temperature thấp (0.1)**: Giảm khả năng AI tự bịa thông tin
- **Prompt engineering chặt chẽ**: Hướng dẫn AI chỉ sử dụng dữ liệu có sẵn
- **Validation**: Kiểm tra dữ liệu trước khi gửi cho AI
- **Fallback responses**: Trả lời chuẩn khi không có dữ liệu

### 1. Kiểm tra kết nối

```bash
curl -X GET http://localhost:8081/api/gemini/test
```

### 2. Test Chatbot với Câu Hỏi về Sách trong Database

#### Test Case 1: Tìm sách theo từ khóa chung

```bash
curl -X POST http://localhost:8081/api/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Bạn có sách nào về lập trình không?",
    "sessionId": "demo-session-001",
    "userId": 1
  }'
```

#### Test Case 2: Tìm sách theo tác giả

```bash
curl -X POST http://localhost:8081/api/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Sách của tác giả Nguyễn Văn A có những cuốn nào?",
    "sessionId": "demo-session-002",
    "userId": 1
  }'
```

#### Test Case 3: Hỏi về giá sách

```bash
curl -X POST http://localhost:8081/api/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Giá của sách Java cơ bản là bao nhiêu?",
    "sessionId": "demo-session-003",
    "userId": 1
  }'
```

#### Test Case 4: Kiểm tra tồn kho

```bash
curl -X POST http://localhost:8081/api/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Sách Python còn hàng không?",
    "sessionId": "demo-session-004",
    "userId": 1
  }'
```

#### Test Case 5: Tìm sách theo chủ đề

```bash
curl -X POST http://localhost:8081/api/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Tôi muốn tìm sách về công nghệ thông tin",
    "sessionId": "demo-session-005",
    "userId": 1
  }'
```

#### Test Case 6: Câu hỏi không liên quan đến sách

```bash
curl -X POST http://localhost:8081/api/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Thời tiết hôm nay thế nào?",
    "sessionId": "demo-session-006",
    "userId": 1
  }'
```

### 3. Test với Postman

#### Postman Collection:

1. **Test Connection**

   - Method: GET
   - URL: `http://localhost:8081/api/gemini/test`

2. **Chatbot Ask**
   - Method: POST
   - URL: `http://localhost:8081/api/chatbot/ask`
   - Headers:
     ```
     Content-Type: application/json
     ```
   - Body (raw JSON):
     ```json
     {
       "prompt": "Bạn có sách nào về Java không?",
       "sessionId": "{{$randomUUID}}",
       "userId": 1
     }
     ```

## Kỳ Vọng Response

### Response thành công khi tìm thấy sách:

```json
{
  "content": "Dựa trên dữ liệu từ cửa hàng sách của chúng tôi, tôi tìm thấy những cuốn sách về Java sau:\n\n- Java Programming Fundamentals\n  Tác giả: John Smith\n  Giá: 250,000 VND\n  Tồn kho: 15 cuốn\n  Mô tả: Sách học Java cơ bản...\n\nBạn có muốn tôi tư vấn thêm về cuốn sách nào không?",
  "sessionId": "demo-session-001",
  "success": true,
  "error": null
}
```

### Response khi không tìm thấy sách:

```json
{
  "content": "Xin lỗi, hiện tại cửa hàng chúng tôi không có sách nào phù hợp với yêu cầu của bạn. Bạn có thể thử tìm kiếm với từ khóa khác hoặc liên hệ với chúng tôi để được hỗ trợ thêm.",
  "sessionId": "demo-session-002",
  "success": true,
  "error": null
}
```

## Features của Chatbot

### 1. **Database Integration**

- Tự động tìm kiếm sách trong database
- Lấy thông tin chính xác: tên sách, tác giả, giá, tồn kho
- Hiển thị mô tả và giới thiệu sách

### 2. **Smart Search**

- Tìm kiếm theo tên sách (title)
- Tìm kiếm theo tác giả (authorName)
- Không phân biệt hoa thường (IgnoreCase)
- Tìm kiếm một phần từ (Containing)

### 3. **Natural Language Processing**

- Nhận diện từ khóa liên quan đến sách
- Phản hồi bằng tiếng Việt tự nhiên
- Tích hợp AI Gemini cho câu trả lời thông minh

### 4. **Keywords Detection**

Chatbot sẽ kích hoạt tìm kiếm database khi phát hiện:

- "sách", "book"
- "tìm", "có"
- "giá", "mua", "bán"

### 5. **Conversation Context**

- Duy trì sessionId để theo dõi cuộc trò chuyện
- Xử lý nhiều câu hỏi liên tiếp

## Debugging

### Kiểm tra Database Connection:

```bash
curl -X GET http://localhost:8081/api/v1/books?page=0&size=5
```

### Kiểm tra Log:

- Xem terminal output để debug
- Kiểm tra query SQL được thực thi
- Xem response từ Gemini API

## Performance

### Optimization Features:

- Giới hạn tối đa 5 kết quả tìm kiếm
- Cache session conversation
- Timeout handling cho Gemini API
- Graceful error handling

## Security

- API endpoints được cấu hình public trong SecurityConfig
- Không cần authentication để test
- CORS được cấu hình cho localhost:3000
