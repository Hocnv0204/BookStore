package com.bookstore.backend.service.impl;

import com.bookstore.backend.dto.request.GeminiRequest;
import com.bookstore.backend.dto.response.GeminiResponse;
import com.bookstore.backend.model.Book;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.service.ChatbotService;
import com.bookstore.backend.service.ChatSessionService;
import com.bookstore.backend.service.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotServiceImpl implements ChatbotService {

    private final GeminiService geminiService;
    private final BookRepository bookRepository;
    private final ChatSessionService chatSessionService;

    @Override
    public GeminiResponse chatWithBookstore(GeminiRequest request) {
        try {
            // Xử lý session theo userId
            String sessionId = request.getSessionId();
            Long userId = request.getUserId();
            
            // Nếu có userId, ưu tiên sử dụng userId để quản lý session
            if (userId != null) {
                sessionId = chatSessionService.getOrCreateSessionForUser(userId);
            } else if (sessionId == null || sessionId.isEmpty()) {
                sessionId = UUID.randomUUID().toString();
            }

            // Lấy ngữ cảnh từ lịch sử chat (ưu tiên userId)
            String chatHistory;
            if (userId != null) {
                chatHistory = chatSessionService.buildContextFromUserHistory(userId, 10);
            } else {
                chatHistory = chatSessionService.buildContextFromHistory(sessionId, 10);
            }

            // Truy xuất dữ liệu từ database dựa trên câu hỏi và context
            String dbInfo = getRelevantBookDataWithContext(request.getPrompt(), chatHistory);

            // Tạo prompt cho Gemini với context từ database và lịch sử
            String enhancedPrompt = buildPromptWithContext(request.getPrompt(), dbInfo, chatHistory);

            // Tạo request cho Gemini
            GeminiRequest geminiRequest = GeminiRequest.builder()
                    .prompt(enhancedPrompt)
                    .sessionId(sessionId)
                    .userId(userId)
                    .build();

            // Gọi Gemini API
            GeminiResponse response = geminiService.askGemini(geminiRequest);
            response.setSessionId(sessionId);

            // Lưu tin nhắn vào session (ưu tiên userId)
            if (response.isSuccess()) {
                if (userId != null) {
                    chatSessionService.saveMessageWithUserId(userId, request.getPrompt(), response.getContent());
                } else {
                    chatSessionService.saveMessage(sessionId, request.getPrompt(), response.getContent());
                }
            }

            return response;

        } catch (Exception e) {
            log.error("Error in chatbot service: ", e);
            return GeminiResponse.builder()
                    .content("Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.")
                    .sessionId(request.getSessionId())
                    .success(false)
                    .error(e.getMessage())
                    .build();
        }
    }

    private String getRelevantBookDataWithContext(String userMessage, String chatHistory) {
        StringBuilder dbInfo = new StringBuilder();

        // Phân tích context từ lịch sử để hiểu người dùng đang hỏi gì
        String searchContext = analyzeSearchContext(userMessage, chatHistory);
        
        // Kiểm tra xem khách có hỏi về tồn kho không
        boolean askingForStock = isAskingForStock(userMessage, chatHistory);
        
        // Kiểm tra nếu người dùng hỏi về sách
        if (containsBookKeywords(userMessage) || isContextualBookQuery(chatHistory, userMessage)) {
            List<Book> books = searchBooksIntelligent(userMessage, searchContext);
            
            if (!books.isEmpty()) {
                dbInfo.append("=== THÔNG TIN CHI TIẾT SÁCH TỪ CỬA HÀNG ===\n\n");
                
                for (int i = 0; i < Math.min(books.size(), 5); i++) {
                    Book book = books.get(i);
                    dbInfo.append("📚 ").append("─".repeat(50)).append("\n");
                    dbInfo.append(String.format("🆔 ID: %d\n", book.getId()));
                    dbInfo.append(String.format("📖 Tên sách: %s\n", book.getTitle()));
                    dbInfo.append(String.format("✍️ Tác giả: %s\n", book.getAuthorName()));
                    dbInfo.append(String.format("💰 Giá bán: %,.0f VND\n", book.getPrice()));
                    
                    // Thêm thông tin category với emoji
                    if (book.getCategory() != null) {
                        dbInfo.append(String.format("🏷️ Thể loại: %s\n", book.getCategory().getName()));
                    }
                    
                    // Thêm thông tin publisher
                    if (book.getPublisher() != null) {
                        dbInfo.append(String.format("🏢 Nhà xuất bản: %s\n", book.getPublisher().getName()));
                    }
                    
                    // Thêm thông tin distributor
                    if (book.getDistributor() != null) {
                        dbInfo.append(String.format("🚚 Nhà phân phối: %s\n", book.getDistributor().getName()));
                    }
                    
                    // Thêm mô tả chi tiết (luôn hiển thị)
                    if (book.getDescription() != null && !book.getDescription().trim().isEmpty()) {
                        dbInfo.append(String.format("📝 Mô tả sách:\n%s\n", book.getDescription()));
                    } else {
                        dbInfo.append("📝 Mô tả sách: Đang cập nhật thông tin\n");
                    }
                    
                    // Thêm giới thiệu (luôn hiển thị)
                    if (book.getIntroduction() != null && !book.getIntroduction().trim().isEmpty()) {
                        dbInfo.append(String.format("📋 Giới thiệu:\n%s\n", book.getIntroduction()));
                    } else {
                        dbInfo.append("📋 Giới thiệu: Đang cập nhật thông tin\n");
                    }
                    
                    // Chỉ hiển thị thông tin tồn kho khi khách hỏi
                    if (askingForStock) {
                        dbInfo.append(String.format("📦 Số lượng tồn: %d cuốn\n", book.getQuantityStock()));
                        String status = book.getQuantityStock() > 0 ? "✅ Còn hàng" : "❌ Hết hàng";
                        dbInfo.append(String.format("📊 Trạng thái: %s\n", status));
                    } else {
                        // Chỉ hiển thị trạng thái có/hết hàng
                        String status = book.getQuantityStock() > 0 ? "✅ Có sẵn" : "❌ Hết hàng";
                        dbInfo.append(String.format("📊 Trạng thái: %s\n", status));
                    }
                    
                    dbInfo.append("\n");
                }
                
                // Thêm gợi ý tìm kiếm thêm
                if (books.size() > 5) {
                    dbInfo.append(String.format("📌 Còn %d cuốn sách khác phù hợp. Bạn có muốn xem thêm không?\n", books.size() - 5));
                }
                
                // Thêm gợi ý hỏi thêm thông tin
                if (!askingForStock) {
                    dbInfo.append("\n💡 Gợi ý: Bạn có thể hỏi thêm về số lượng tồn kho, so sánh với sách khác, hoặc được tư vấn thêm.\n");
                }
                
            } else {
                // Không tìm thấy sách, đưa ra gợi ý
                dbInfo.append("❌ KHÔNG TÌM THẤY SÁCH PHÙ HỢP\n\n");
                dbInfo.append("💡 GỢI Ý TÌM KIẾM:\n");
                dbInfo.append("- Thử tìm với từ khóa ngắn hơn\n");
                dbInfo.append("- Kiểm tra chính tả tên sách hoặc tác giả\n");
                dbInfo.append("- Hỏi theo thể loại (kinh doanh, văn học, khoa học...)\n");
                
                // Đề xuất sách phổ biến
                List<Book> popularBooks = getPopularBooks();
                if (!popularBooks.isEmpty()) {
                    dbInfo.append("\n🔥 SÁCH PHỔ BIẾN:\n");
                    for (Book book : popularBooks.subList(0, Math.min(3, popularBooks.size()))) {
                        dbInfo.append(String.format("- %s - %s (%.0f VND)\n", 
                                book.getTitle(), book.getAuthorName(), book.getPrice()));
                    }
                }
            }
        }
        
        return dbInfo.toString();
    }

    private String analyzeSearchContext(String userMessage, String chatHistory) {
        // Phân tích context từ lịch sử để hiểu người dùng muốn tìm gì
        StringBuilder context = new StringBuilder();
        
        // Tìm thể loại từ lịch sử
        if (chatHistory.contains("kinh doanh") || chatHistory.contains("business")) {
            context.append("kinh doanh ");
        }
        if (chatHistory.contains("văn học") || chatHistory.contains("literature")) {
            context.append("văn học ");
        }
        if (chatHistory.contains("khoa học") || chatHistory.contains("science")) {
            context.append("khoa học ");
        }
        if (chatHistory.contains("tiểu thuyết") || chatHistory.contains("novel")) {
            context.append("tiểu thuyết ");
        }
        if (chatHistory.contains("truyện") || chatHistory.contains("story")) {
            context.append("truyện ");
        }
        
        return context.toString().trim();
    }

    private boolean isContextualBookQuery(String chatHistory, String userMessage) {
        // Kiểm tra xem có phải câu hỏi tiếp theo trong context không
        String lowerMessage = userMessage.toLowerCase().trim();
        
        // Nếu user chỉ nói tên sách hoặc số thứ tự sau khi AI đã giới thiệu sách
        if (chatHistory.contains("giới thiệu") || chatHistory.contains("có thể") || chatHistory.contains("sách")) {
            // Các dấu hiệu cho thấy user đang chọn sách từ danh sách đã đưa ra
            return lowerMessage.matches(".*\\b(cuốn|quyển|số|thứ)\\s*\\d+.*") || // "cuốn 1", "số 2"
                   lowerMessage.matches(".*\\b\\d+\\b.*") || // chỉ số
                   lowerMessage.split("\\s+").length <= 3; // tên ngắn
        }
        
        return false;
    }

    private List<Book> searchBooksIntelligent(String query, String context) {
        List<Book> results = new ArrayList<>();
        
        // Kết hợp query với context
        String fullQuery = (context + " " + query).trim();
        String[] keywords = extractKeywords(fullQuery);
        
        // 1. Tìm kiếm theo tên sách (ưu tiên cao nhất)
        for (String keyword : keywords) {
            if (keyword.length() >= 2) {
                Page<Book> bookPage = bookRepository.findByTitleContainingIgnoreCase(keyword, PageRequest.of(0, 10));
                results.addAll(bookPage.getContent());
                if (results.size() >= 5) break;
            }
        }
        
        // 2. Tìm kiếm theo tác giả
        if (results.size() < 5) {
            for (String keyword : keywords) {
                if (keyword.length() >= 2) {
                    Page<Book> bookPage = bookRepository.findByAuthorNameContainingIgnoreCase(keyword, PageRequest.of(0, 10));
                    results.addAll(bookPage.getContent());
                    if (results.size() >= 10) break;
                }
            }
        }
        
        // 3. Tìm kiếm theo thể loại nếu có context
        if (results.size() < 5 && !context.isEmpty()) {
            Page<Book> bookPage = bookRepository.findByCategoryNameContainingIgnoreCase(context, PageRequest.of(0, 10));
            results.addAll(bookPage.getContent());
        }
        
        // 4. Tìm kiếm tổng hợp nếu vẫn ít kết quả
        if (results.size() < 3) {
            for (String keyword : keywords) {
                if (keyword.length() >= 2) {
                    Page<Book> bookPage = bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(
                            keyword, keyword, PageRequest.of(0, 15));
                    results.addAll(bookPage.getContent());
                }
            }
        }
        
        // Loại bỏ duplicate và giới hạn kết quả
        return results.stream()
                .distinct()
                .limit(10)
                .collect(Collectors.toList());
    }

    private boolean isAskingForStock(String userMessage, String chatHistory) {
        String lowerMessage = userMessage.toLowerCase();
        String lowerHistory = chatHistory.toLowerCase();
        
        // Các từ khóa liên quan đến tồn kho
        String[] stockKeywords = {
            "tồn kho", "còn hàng", "hết hàng", "số lượng", "còn bao nhiêu", 
            "còn không", "có sẵn", "trong kho", "inventory", "stock",
            "còn mấy", "bao nhiêu cuốn", "cuốn còn lại", "còn lại",
            "đặt hàng", "mua được", "available"
        };
        
        // Kiểm tra trong message hiện tại
        for (String keyword : stockKeywords) {
            if (lowerMessage.contains(keyword)) {
                return true;
            }
        }
        
        // Kiểm tra trong lịch sử gần đây (chỉ 2-3 tin nhắn gần nhất)
        String[] recentHistory = lowerHistory.split("\\n");
        int recentCount = Math.min(3, recentHistory.length);
        for (int i = Math.max(0, recentHistory.length - recentCount); i < recentHistory.length; i++) {
            for (String keyword : stockKeywords) {
                if (recentHistory[i].contains(keyword)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    private List<Book> getPopularBooks() {
        try {
            // Sử dụng method có sẵn trong repository
            return bookRepository.findTop20ByOrderByIdDesc();
        } catch (Exception e) {
            log.error("Error getting popular books: ", e);
            // Fallback: lấy 10 sách đầu tiên
            return bookRepository.findAll().stream().limit(10).collect(Collectors.toList());
        }
    }

    private boolean containsBookKeywords(String message) {
        String lowerMessage = message.toLowerCase();
        return lowerMessage.contains("sách") || 
               lowerMessage.contains("book") || 
               lowerMessage.contains("tìm") ||
               lowerMessage.contains("tìm kiếm") ||
               lowerMessage.contains("có") ||
               lowerMessage.contains("giá") ||
               lowerMessage.contains("bao nhiêu") ||
               lowerMessage.contains("mua") ||
               lowerMessage.contains("bán") ||
               lowerMessage.contains("tác giả") ||
               lowerMessage.contains("author") ||
               lowerMessage.contains("nhà xuất bản") ||
               lowerMessage.contains("publisher") ||
               lowerMessage.contains("thể loại") ||
               lowerMessage.contains("category") ||
               lowerMessage.contains("còn hàng") ||
               lowerMessage.contains("hết hàng") ||
               lowerMessage.contains("tồn kho") ||
               lowerMessage.contains("kinh doanh") ||
               lowerMessage.contains("văn học") ||
               lowerMessage.contains("khoa học") ||
               lowerMessage.contains("tiểu thuyết") ||
               lowerMessage.contains("truyện") ||
               lowerMessage.contains("novel");
    }

    private String[] extractKeywords(String query) {
        // Loại bỏ các từ không cần thiết và tách từ khóa
        String cleanQuery = query.toLowerCase()
                .replaceAll("\\b(tìm|kiếm|có|không|sách|book|tác giả|author|giá|bao nhiêu|vnd|đồng|cho|tôi|mình|bạn|cuốn|quyển)\\b", "")
                .replaceAll("[^a-zA-Z0-9\\sàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]", " ")
                .replaceAll("\\s+", " ")
                .trim();
        
        return Arrays.stream(cleanQuery.split("\\s+"))
                .filter(word -> word.length() >= 2)
                .toArray(String[]::new);
    }

    private String buildPromptWithContext(String userMessage, String dbInfo, String chatHistory) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("🤖 Bạn là BookStore AI Assistant - chuyên gia tư vấn sách thông minh tại cửa hàng BookStore.\n\n");
        
        prompt.append("🎯 NHIỆM VỤ CHÍNH:\n");
        prompt.append("- Hiểu context từ cuộc hội thoại trước đó\n");
        prompt.append("- Trả lời chi tiết về nội dung, giá trị của sách dựa trên MÔ TẢ và GIỚI THIỆU\n");
        prompt.append("- Tư vấn sách phù hợp dựa trên nhu cầu khách hàng\n");
        prompt.append("- Duy trì ngữ cảnh hội thoại liên tục\n\n");
        
        prompt.append("📋 NGUYÊN TẮC HOẠT ĐỘNG:\n");
        prompt.append("1. 🔍 LUÔN ưu tiên thông tin từ DATABASE thực tế\n");
        prompt.append("2. 🚫 KHÔNG BAO GIỜ bịa đặt thông tin về sách, giá cả, tác giả\n");
        prompt.append("3. 💬 HIỂU context: nếu khách đã hỏi về thể loại, tiếp tục trong context đó\n");
        prompt.append("4. 📖 MÔ TẢ chi tiết nội dung dựa trên DESCRIPTION và INTRODUCTION từ database\n");
        prompt.append("5. 💰 Luôn đề cập giá chính xác với đơn vị VND\n");
        prompt.append("6. 📊 CHỈ nói về số lượng tồn kho khi khách hàng hỏi cụ thể\n");
        prompt.append("7. 💡 Đề xuất sách liên quan phù hợp\n");
        prompt.append("8. 🎨 Sử dụng format đẹp mắt, dễ đọc\n\n");
        
        // Context từ lịch sử hội thoại
        if (!chatHistory.isEmpty()) {
            prompt.append("📚 NGỮ CẢNH HỘI THOẠI TRƯỚC:\n");
            prompt.append(chatHistory).append("\n\n");
            prompt.append("⚠️ LƯU Ý: Hãy duy trì ngữ cảnh này và trả lời tiếp theo logic của cuộc hội thoại.\n\n");
        }
        
        // Dữ liệu từ database
        if (!dbInfo.isEmpty()) {
            prompt.append("🗃️ DỮ LIỆU TỪ CỬA HÀNG:\n");
            prompt.append(dbInfo).append("\n\n");
        }
        
        prompt.append("❓ CÂU HỎI KHÁCH HÀNG: ").append(userMessage).append("\n\n");
        
        prompt.append("📝 HƯỚNG DẪN TRẢ LỜI:\n");
        prompt.append("✅ Trả lời thân thiện, chuyên nghiệp và chi tiết\n");
        prompt.append("✅ Sử dụng emoji và format đẹp mắt\n");
        prompt.append("✅ Mô tả cụ thể về nội dung dựa trên DESCRIPTION và INTRODUCTION\n");
        prompt.append("✅ Giải thích giá trị và lợi ích của sách\n");
        prompt.append("✅ Nếu có nhiều sách, hiển thị 3-5 cuốn phù hợp nhất\n");
        prompt.append("✅ Đưa ra lý do tại sao nên chọn sách này\n");
        prompt.append("✅ Hỏi thêm về sở thích để tư vấn tốt hơn\n");
        prompt.append("✅ Nếu khách hỏi tiếp về sách đã giới thiệu, trả lời chi tiết về sách đó\n");
        prompt.append("✅ KHÔNG nhắc đến số lượng tồn kho trừ khi khách hỏi cụ thể\n\n");
        
        return prompt.toString();
    }
}
