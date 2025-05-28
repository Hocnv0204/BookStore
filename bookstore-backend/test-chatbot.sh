#!/bin/bash

# Test script cho Chatbot Database Integration
echo "=== CHATBOT DATABASE INTEGRATION TEST ==="
echo ""

BASE_URL="http://localhost:8080"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}1. Testing connection...${NC}"
curl -s -X GET "$BASE_URL/api/gemini/test"
echo -e "\n"

echo -e "${YELLOW}2. Getting example questions...${NC}"
curl -s -X GET "$BASE_URL/api/demo/examples" | jq .
echo -e "\n"

echo -e "${YELLOW}3. Testing chatbot with book search...${NC}"
curl -s -X POST "$BASE_URL/api/demo/chatbot" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tìm sách về lập trình Java",
    "sessionId": "test-session-001"
  }' | jq .
echo -e "\n"

echo -e "${YELLOW}4. Testing with author search...${NC}"
curl -s -X POST "$BASE_URL/api/demo/chatbot" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Có sách nào của tác giả Nguyễn Nhật Ánh không?",
    "sessionId": "test-session-002"
  }' | jq .
echo -e "\n"

echo -e "${YELLOW}5. Testing with price inquiry...${NC}"
curl -s -X POST "$BASE_URL/api/demo/chatbot" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Sách Doraemon giá bao nhiêu?",
    "sessionId": "test-session-003"
  }' | jq .
echo -e "\n"

echo -e "${YELLOW}6. Testing with non-existent book (should not hallucinate)...${NC}"
curl -s -X POST "$BASE_URL/api/demo/chatbot" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Có sách Harry Potter không?",
    "sessionId": "test-session-004"
  }' | jq .
echo -e "\n"

echo -e "${YELLOW}7. Testing general store info...${NC}"
curl -s -X POST "$BASE_URL/api/demo/chatbot" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Cho tôi biết thông tin về cửa hàng",
    "sessionId": "test-session-005"
  }' | jq .
echo -e "\n"

echo -e "${GREEN}Test completed!${NC}"
echo -e "${YELLOW}Note: Make sure your server is running on port 8080 and you have jq installed for JSON formatting.${NC}"
