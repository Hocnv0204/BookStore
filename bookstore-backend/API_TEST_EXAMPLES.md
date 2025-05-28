# API Test Examples for Chatbot Gemini Integration

## Base URL

```
http://localhost:8080
```

## Available Endpoints

### 1. Test Connection

**GET** `/api/gemini/test`

**Description:** Kiểm tra xem API có hoạt động không

**Request:**

```bash
curl -X GET http://localhost:8080/api/gemini/test
```

**Expected Response:**

```
Gemini API controller is working!
```

---

### 2. Direct Gemini API Call

**POST** `/api/gemini/ask`

**Description:** Gọi trực tiếp Gemini API mà không có dữ liệu từ database

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "prompt": "Xin chào, bạn có thể giúp tôi không?",
  "sessionId": "session-001",
  "userId": 3
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:8080/api/gemini/ask \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Xin chào, bạn có thể giúp tôi không?",
    "sessionId": "session-001",
    "userId": 1
  }'
```

**Expected Response:**

```json
{
  "content": "Xin chào! Tôi có thể giúp bạn...",
  "sessionId": "session-001",
  "success": true,
  "error": null
}
```

---

### 3. Chatbot with Database Integration (RECOMMENDED)

**POST** `/api/chatbot/ask`

**Description:** Chatbot thông minh có tích hợp dữ liệu từ database bookstore

**Headers:**

```
Content-Type: application/json
```

**Test Cases:**

#### 3.1 Hỏi về sách cụ thể

**Request Body:**

```json
{
  "prompt": "Bạn có sách nào về lập trình Java không?",
  "sessionId": "chatbot-session-001",
  "userId": 1
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:8080/api/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Bạn có sách nào về lập trình Java không?",
    "sessionId": "chatbot-session-001",
    "userId": 1
  }'
```

#### 3.2 Tìm sách theo tác giả

**Request Body:**

```json
{
  "prompt": "Sách của tác giả Nguyễn Văn A có những cuốn nào?",
  "sessionId": "chatbot-session-002",
  "userId": 1
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:8080/api/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Sách của tác giả Nguyễn Văn A có những cuốn nào?",
    "sessionId": "chatbot-session-002",
    "userId": 1
  }'
```

#### 3.3 Hỏi về giá sách

**Request Body:**

```json
{
  "prompt": "Cho tôi biết giá của cuốn sách ABC?",
  "sessionId": "chatbot-session-003",
  "userId": 1
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:8080/api/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Cho tôi biết giá của cuốn sách ABC?",
    "sessionId": "chatbot-session-003",
    "userId": 1
  }'
```

#### 3.4 Hỏi về tồn kho

**Request Body:**

```json
{
  "prompt": "Sách XYZ còn hàng không?",
  "sessionId": "chatbot-session-004",
  "userId": 1
}
```

#### 3.5 Câu hỏi chung không liên quan đến sách

**Request Body:**

```json
{
  "prompt": "Thời tiết hôm nay thế nào?",
  "sessionId": "chatbot-session-005",
  "userId": 1
}
```

**Expected Response Format:**

```json
{
  "content": "Dựa trên dữ liệu từ cửa hàng sách của chúng tôi...",
  "sessionId": "chatbot-session-001",
  "success": true,
  "error": null
}
```

---

## Postman Collection Setup

### 1. Import vào Postman

- Tạo Collection mới: "Bookstore Chatbot API"
- Add các request sau:

### 2. Environment Variables

```
base_url: http://localhost:8080
```

### 3. Request Templates

#### Test Connection

- Method: GET
- URL: `{{base_url}}/api/gemini/test`

#### Direct Gemini

- Method: POST
- URL: `{{base_url}}/api/gemini/ask`
- Headers: Content-Type: application/json
- Body (raw JSON):

```json
{
  "prompt": "Your question here",
  "sessionId": "{{$randomUUID}}",
  "userId": 1
}
```

#### Chatbot with Database

- Method: POST
- URL: `{{base_url}}/api/chatbot/ask`
- Headers: Content-Type: application/json
- Body (raw JSON):

```json
{
  "prompt": "Bạn có sách nào về lập trình không?",
  "sessionId": "{{$randomUUID}}",
  "userId": 1
}
```

---

## Testing Scenarios

### Functional Testing

1. **Test connection** - Verify API is running
2. **Direct Gemini** - Test pure AI response
3. **Book search queries** - Test database integration
4. **Invalid requests** - Test error handling
5. **Session management** - Test conversation flow

### Performance Testing

- Response time should be < 5 seconds
- Handle concurrent requests
- Memory usage monitoring

### Error Scenarios

1. Invalid JSON format
2. Missing required fields
3. Network issues with Gemini API
4. Database connection problems

---

## Expected Behaviors

### Chatbot Features

1. **Smart book search** - Tìm sách theo tên, tác giả, chủ đề
2. **Inventory check** - Kiểm tra tồn kho
3. **Price information** - Thông tin giá cả
4. **Recommendations** - Gợi ý sách tương tự
5. **Conversational** - Duy trì ngữ cảnh cuộc trò chuyện

### Response Quality

- Accurate information from database
- Natural Vietnamese language
- Helpful and relevant answers
- Graceful handling of unknown queries
