package com.bookstore.backend.service.impl;

import com.bookstore.backend.dto.request.GeminiRequest;
import com.bookstore.backend.dto.response.GeminiResponse;
import com.bookstore.backend.model.Book;
import com.bookstore.backend.model.Category;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.CategoryRepository;
import com.bookstore.backend.service.AITrainingService;
import com.bookstore.backend.service.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AITrainingServiceImpl implements AITrainingService {

    private final GeminiService geminiService;
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public GeminiResponse trainWithExamples(GeminiRequest request) {
        try {
            String trainingPrompt = generateTrainingPrompt();
            String enhancedPrompt = buildTrainingPrompt(request.getPrompt(), trainingPrompt);
            
            GeminiRequest trainingRequest = GeminiRequest.builder()
                    .prompt(enhancedPrompt)
                    .sessionId(request.getSessionId())
                    .userId(request.getUserId())
                    .build();
                    
            return geminiService.askGemini(trainingRequest);
            
        } catch (Exception e) {
            log.error("Error in AI training: ", e);
            return GeminiResponse.builder()
                    .content("Lỗi trong quá trình training AI.")
                    .success(false)
                    .error(e.getMessage())
                    .build();
        }
    }

    @Override
    public String generateTrainingPrompt() {
        StringBuilder trainingData = new StringBuilder();
        
        // Lấy mẫu dữ liệu từ database
        List<Book> sampleBooks = bookRepository.findTop20ByOrderByIdAsc();
        List<Category> categories = categoryRepository.findAll();
        
        trainingData.append("=== DỮ LIỆU TRAINING CHO AI BOOKSTORE ===\n\n");
        
        // Thêm thông tin về categories
        trainingData.append("DANH MỤC SÁCH HIỆN CÓ:\n");
        for (Category category : categories) {
            trainingData.append(String.format("- ID: %d, Tên: %s\n", category.getId(), category.getName()));
        }
        trainingData.append("\n");
        
        // Thêm mẫu sách
        trainingData.append("MẪU SÁCH TRONG KHO:\n");
        for (Book book : sampleBooks) {
            trainingData.append(String.format("- ID: %d\n", book.getId()));
            trainingData.append(String.format("  Tên: %s\n", book.getTitle()));
            trainingData.append(String.format("  Tác giả: %s\n", book.getAuthorName()));
            trainingData.append(String.format("  Giá: %.0f VND\n", book.getPrice()));
            trainingData.append(String.format("  Tồn kho: %d\n", book.getQuantityStock()));
            if (book.getCategory() != null) {
                trainingData.append(String.format("  Thể loại: %s\n", book.getCategory().getName()));
            }
            trainingData.append("\n");
        }
        
        // Thêm ví dụ hội thoại
        trainingData.append(getConversationExamples());
        
        return trainingData.toString();
    }
    
    private String getConversationExamples() {
        return """
        === VÍ DỤ HỘI THOẠI CHUẨN ===
        
        VÍ DỤ 1:
        Khách: "Có sách Harry Potter không?"
        AI: "Cửa hàng có các cuốn sách Harry Potter sau:
        - Harry Potter và Hòn đá Phù thủy - Tác giả: J.K. Rowling - Giá: 150,000 VND - Còn 25 cuốn
        - Harry Potter và Phòng chứa Bí mật - Tác giả: J.K. Rowling - Giá: 160,000 VND - Còn 18 cuốn
        Bạn muốn biết thêm thông tin về cuốn nào?"
        
        VÍ DỤ 2:
        Khách: "Sách giá dưới 100k có gì?"
        AI: "Các sách có giá dưới 100,000 VND:
        - [Liệt kê sách với giá cụ thể từ database]
        - [Chỉ thông tin thực tế, không bịa]"
        
        VÍ DỤ 3:
        Khách: "Có sách của Nguyễn Nhật Ánh không?"
        AI: "Hiện tại cửa hàng có các tác phẩm của Nguyễn Nhật Ánh:
        - [Chỉ liệt kê nếu có trong database]
        - [Nếu không có: 'Hiện tại chưa có sách của tác giả này']"
        
        QUY TẮC QUAN TRỌNG:
        1. LUÔN kiểm tra database trước khi trả lời
        2. KHÔNG bịa thông tin về sách không có trong kho
        3. Luôn đề cập giá chính xác với đơn vị VND
        4. Thông báo số lượng tồn kho
        5. Nếu hết hàng, đề xuất sách tương tự
        """;
    }
    
    private String buildTrainingPrompt(String userQuery, String trainingData) {
        return String.format("""
        %s
        
        === NHIỆM VỤ ===
        Dựa trên dữ liệu training ở trên, hãy trả lời câu hỏi sau một cách chính xác:
        
        CÂU HỎI: %s
        
        LƯU Ý:
        - Chỉ sử dụng thông tin từ dữ liệu training
        - Không bịa đặt thông tin
        - Trả lời một cách tự nhiên và thân thiện
        - Đề xuất các sách liên quan nếu phù hợp
        """, trainingData, userQuery);
    }

    @Override
    public void updateTrainingExamples() {
        // Có thể implement logic để cập nhật ví dụ training
        // dựa trên feedback từ người dùng
        log.info("Training examples updated");
    }
}
