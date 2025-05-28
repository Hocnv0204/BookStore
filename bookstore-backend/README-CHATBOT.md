# Chatbot Database Integration - README

## Tổng quan

Bạn đã có một chatbot AI hoàn chỉnh tích hợp với database, có khả năng:

### ✅ Đã cài đặt xong:

1. **GeminiService** - Tích hợp Gemini AI API
2. **ChatbotService** - Xử lý logic chatbot với database
3. **ChatSessionService** - Quản lý session và lịch sử chat
4. **Controllers** - API endpoints cho chatbot
5. **Configuration** - Cấu hình linh hoạt cho Gemini
6. **Anti-Hallucination** - Ngăn AI tự bịa thông tin

### 🎯 Tính năng chính:

#### 1. **Đọc dữ liệu Database chính xác**

- Tìm kiếm sách theo tên, tác giả
- Hiển thị giá, tồn kho, thông tin chi tiết
- Chỉ sử dụng dữ liệu thực tế từ database

#### 2. **Anti-Hallucination System**

- Temperature thấp (0.1) để giảm việc AI tự bịa
- Prompt engineering chặt chẽ
- Validation dữ liệu trước khi trả lời
- Response "không có thông tin" thay vì bịa ra

#### 3. **Smart Search & Keywords**

- Nhận diện từ khóa: sách, book, tìm, giá, mua, bán...
- Tìm kiếm linh hoạt theo tên sách hoặc tác giả
- Loại bỏ từ không cần thiết trong query

#### 4. **Session Management**

- Lưu lịch sử chat theo session
- Hiểu ngữ cảnh cuộc trò chuyện
- API để quản lý session (xóa, xem lịch sử)

## API Endpoints

### 🚀 Sử dụng chính:

```bash
# Chat với chatbot (có tích hợp database)
POST /api/chatbot/ask

# Demo chatbot (simplified)
POST /api/demo/chatbot

# Lấy ví dụ câu hỏi
GET /api/demo/examples

# Quản lý session
GET /api/chatbot/session/{sessionId}/history
DELETE /api/chatbot/session/{sessionId}
```

## Cách test

### 1. **Bằng script tự động:**

```bash
./test-chatbot.sh
```

### 2. **Bằng curl thủ công:**

```bash
curl -X POST http://localhost:8080/api/demo/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tìm sách về lập trình Java"
  }'
```

### 3. **Test cases quan trọng:**

- ✅ Tìm sách có trong database
- ✅ Hỏi về sách không có (kiểm tra anti-hallucination)
- ✅ Hỏi giá sách, tồn kho
- ✅ Tìm theo tác giả
- ✅ Câu hỏi không liên quan đến sách

## Cấu hình

### Environment Variables cần thiết:

```bash
export GEMINI_API_KEY="your-actual-gemini-api-key"
```

### Trong application.yml:

```yaml
gemini:
  api-key: ${GEMINI_API_KEY:your-gemini-api-key-here}
  temperature: 0.1 # Quan trọng: thấp để tránh hallucination
```

## Kiến trúc

```
ChatbotController
    ↓
ChatbotServiceImpl
    ↓ (truy vấn DB)
BookRepository
    ↓ (tạo prompt với dữ liệu thực)
GeminiServiceImpl
    ↓ (gọi AI với prompt chặt chẽ)
Gemini API
    ↓
ChatSessionServiceImpl (lưu lịch sử)
```

## Điểm mạnh của implementation:

### 🛡️ **Anti-Hallucination:**

- Prompt có quy tắc chặt chẽ
- Temperature thấp (0.1)
- Validation dữ liệu trước khi gửi AI
- Fallback response khi không có dữ liệu

### 🔍 **Smart Search:**

- Tìm kiếm linh hoạt (IgnoreCase, Containing)
- Extract keywords thông minh
- Hỗ trợ tiếng Việt có dấu

### 💾 **Session Management:**

- Lưu lịch sử trong memory
- Context-aware conversation
- API để quản lý session

### 🎯 **User Experience:**

- Response bằng tiếng Việt tự nhiên
- Thông báo rõ ràng khi không có dữ liệu
- Gợi ý tìm kiếm khác

## Files đã tạo/sửa:

1. **Services:**

   - `GeminiService.java` & `GeminiServiceImpl.java`
   - `ChatbotService.java` & `ChatbotServiceImpl.java`
   - `ChatSessionService.java` & `ChatSessionServiceImpl.java`

2. **Controllers:**

   - `GeminiController.java` (updated)
   - `ChatbotDemoController.java` (new)

3. **Configuration:**

   - `GeminiConfig.java` (new)
   - `application.yml` (updated)

4. **Documentation:**
   - `CHATBOT_DATABASE_DEMO.md` (updated)
   - `test-chatbot.sh` (new)
   - `README-CHATBOT.md` (this file)

## Bước tiếp theo:

1. **Chạy server:** `mvn spring-boot:run`
2. **Set API key:** Export GEMINI_API_KEY
3. **Test:** Chạy `./test-chatbot.sh`
4. **Integrate frontend:** Sử dụng `/api/demo/chatbot` endpoint

Your chatbot is ready! 🚀
