import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./ChatBot.css";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Generate a key for localStorage based on user login status
  const getChatStorageKey = useCallback(() => {
    const { isLoggedIn, userId } = getUserInfo();
    return isLoggedIn ? `chatbot_messages_${userId}` : "chatbot_messages_guest";
  }, []);

  // Save messages to localStorage
  const saveMessagesToStorage = useCallback(
    (msgs) => {
      try {
        const storageKey = getChatStorageKey();
        localStorage.setItem(storageKey, JSON.stringify(msgs));
      } catch (error) {
        console.error("Error saving messages to storage:", error);
      }
    },
    [getChatStorageKey]
  );

  // Load messages from localStorage
  const loadMessagesFromStorage = useCallback(() => {
    try {
      const storageKey = getChatStorageKey();
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages) {
        const messages = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        return messages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error loading messages from storage:", error);
      return [];
    }
  }, [getChatStorageKey]);

  // Clear messages from localStorage
  const clearMessagesFromStorage = useCallback(() => {
    try {
      const storageKey = getChatStorageKey();
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("Error clearing messages from storage:", error);
    }
  }, [getChatStorageKey]);

  // Check if user is at the bottom of chat
  const isUserAtBottom = () => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 50;
  };

  // Handle scroll event to show/hide scroll button
  const handleScroll = () => {
    setShowScrollButton(!isUserAtBottom());
  };

  // Auto scroll to bottom when new messages are added (only if user is near bottom)
  // Auto scroll to bottom when a new message is added
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setShowScrollButton(false);
    }
  }, [messages.length, isOpen]);

  // Auto scroll to bottom when chat is opened
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the chat window is fully rendered
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowScrollButton(false);
      }, 150);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  // Get user info and initialize chat
  const getUserInfo = () => {
    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      return {
        isLoggedIn: !!userObj.id,
        userId: userObj.id || null,
      };
    } catch (error) {
      return {
        isLoggedIn: false,
        userId: null,
      };
    }
  };

  const setWelcomeMessage = useCallback(() => {
    const welcomeMessage = [
      {
        id: 1,
        text: "Xin chào! Tôi là trợ lý AI của BookStore. Tôi có thể giúp bạn tìm hiểu về các cuốn sách, giá cả, và đưa ra gợi ý phù hợp. Bạn cần hỗ trợ gì?",
        sender: "bot",
        timestamp: new Date(),
      },
    ];
    setMessages(welcomeMessage);
    saveMessagesToStorage(welcomeMessage);
    // Auto scroll to bottom after setting welcome message
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [saveMessagesToStorage]);

  const loadChatHistory = useCallback(async () => {
    const { isLoggedIn, userId } = getUserInfo();

    // First try to load from localStorage for immediate display
    const localMessages = loadMessagesFromStorage();
    if (localMessages.length > 0) {
      setMessages(localMessages);
    }

    if (isLoggedIn && userId) {
      // User is logged in, load chat history from server
      try {
        const response = await axios.get(
          `http://localhost:8080/api/chatbot/user/${userId}/history?maxMessages=50`
        );

        if (response.data && response.data.length > 0) {
          // Convert history to message format
          // Improved logic to detect message sender
          const historyMessages = response.data.map((msg, index) => {
            // More sophisticated detection of user vs bot messages
            const isUserMessage =
              !msg.toLowerCase().includes("bookstore") &&
              !msg.toLowerCase().includes("xin chào") &&
              !msg.toLowerCase().includes("tôi là trợ lý") &&
              !msg.toLowerCase().includes("tôi có thể giúp") &&
              !msg.toLowerCase().includes("bạn cần hỗ trợ") &&
              !msg.toLowerCase().includes("dựa trên thông tin") &&
              !msg.toLowerCase().includes("theo dữ liệu");

            return {
              id: Date.now() + index,
              text: msg,
              sender: isUserMessage ? "user" : "bot",
              timestamp: new Date(),
            };
          });

          setMessages(historyMessages);
          saveMessagesToStorage(historyMessages);
          // Auto scroll to bottom after loading history
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 200);
        } else if (localMessages.length === 0) {
          // No history and no local messages, show welcome message
          setWelcomeMessage();
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
        if (localMessages.length === 0) {
          setWelcomeMessage();
        }
      }
    } else {
      // User not logged in
      if (localMessages.length === 0) {
        setWelcomeMessage();
      }
    }
  }, [loadMessagesFromStorage, saveMessagesToStorage, setWelcomeMessage]);

  // Load chat history when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadChatHistory();
    }
  }, [isOpen, messages.length, loadChatHistory]);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = loadMessagesFromStorage();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
      // Auto scroll to bottom when messages are loaded
      setTimeout(() => {
        if (isOpen) {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [loadMessagesFromStorage, isOpen]);

  // Check user login status on component mount and when localStorage changes
  useEffect(() => {
    const checkUserStatus = () => {
      const { isLoggedIn } = getUserInfo();
      if (isLoggedIn !== userLoggedIn) {
        setUserLoggedIn(isLoggedIn);
        // Clear messages when login status changes
        if (isOpen) {
          setMessages([]);
          // Reload chat history with new status
          setTimeout(() => {
            loadChatHistory();
          }, 100);
        }
      }
    };

    // Check initially
    checkUserStatus();

    // Listen for storage changes (when user logs in/out)
    window.addEventListener("storage", checkUserStatus);

    // Also check periodically in case localStorage changes without storage event
    const interval = setInterval(checkUserStatus, 2000);

    return () => {
      window.removeEventListener("storage", checkUserStatus);
      clearInterval(interval);
    };
  }, [userLoggedIn, isOpen, loadChatHistory]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (inputMessage.trim() === "" || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const newMessages = [...prev, userMessage];
      saveMessagesToStorage(newMessages);
      return newMessages;
    });
    setInputMessage("");
    setIsLoading(true);

    try {
      // Get user ID from localStorage if available, otherwise use a default
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = userObj.id || 999999; // Use a high number for guest users

      const response = await axios.post(
        "http://localhost:8080/api/chatbot/user/ask",
        {
          prompt: inputMessage,
          userId: userId,
        }
      );

      const botMessage = {
        id: Date.now() + 1,
        text:
          response.data.content ||
          "Xin lỗi, tôi không thể trả lời câu hỏi này.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const newMessages = [...prev, botMessage];
        saveMessagesToStorage(newMessages);
        return newMessages;
      });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => {
        const newMessages = [...prev, errorMessage];
        saveMessagesToStorage(newMessages);
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = async () => {
    try {
      // Get user ID from localStorage if available
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = userObj.id || 999999; // Use same guest user ID

      await axios.delete(
        `http://localhost:8080/api/chatbot/user/${userId}/session`
      );
      setMessages([]);
      clearMessagesFromStorage();
      // Reset with welcome message using the existing function
      setTimeout(() => {
        setWelcomeMessage();
      }, 100);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat Toggle Button */}
      <button className="chatbot-toggle" onClick={toggleChat}>
        {isOpen ? <FaTimes /> : <FaComments />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h4>BookStore AI Assistant</h4>
            <div className="chatbot-header-actions">
              <button
                onClick={clearChat}
                className="clear-chat-btn"
                title="Xóa cuộc trò chuyện"
              >
                🗑️
              </button>
              <button onClick={toggleChat} className="close-chat-btn">
                <FaTimes />
              </button>
            </div>
          </div>

          <div
            className="chatbot-messages"
            ref={messagesContainerRef}
            onScroll={handleScroll}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.sender === "user" ? "user-message" : "bot-message"
                }`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message">
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="typing-text">AI đang soạn tin nhắn...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
            {showScrollButton && (
              <button
                className="scroll-to-bottom-btn"
                onClick={scrollToBottom}
                title="Cuộn xuống tin nhắn mới nhất"
              >
                ↓
              </button>
            )}
          </div>

          <div className="chatbot-input">
            <div className="input-container">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                rows={1}
                disabled={isLoading}
                style={{ minHeight: "24px" }}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || inputMessage.trim() === ""}
                className="send-button"
                type="button"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
