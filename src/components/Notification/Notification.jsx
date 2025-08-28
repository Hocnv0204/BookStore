import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./Notification.css";

function Notification({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Fetch notifications from API
  const fetchNotifications = useCallback(
    async (pageNum = 1, append = false) => {
      try {
        if (pageNum === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        // Determine API endpoint based on user role
        const isAdmin = user?.roles.includes("ADMIN") || user?.isAdmin;
        const apiEndpoint = isAdmin
          ? `http://localhost:8080/admin/notifications?page=${
              pageNum - 1
            }&size=10`
          : `http://localhost:8080/users/notifications?page=${
              pageNum - 1
            }&size=10`;

        const response = await axios.get(apiEndpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const { content, last, totalElements } = response.data;

        // Transform API data to match component format
        const transformedNotifications = content.map((notification) => ({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          time: notification.createdAt,
          unread: notification.status === "UNREAD",
          type: notification.type,
          readAt: notification.readAt,
          relatedOrderId: notification.relatedOrderId,
        }));

        if (append) {
          setNotifications((prev) => [...prev, ...transformedNotifications]);
        } else {
          setNotifications(transformedNotifications);
        }

        setHasMore(!last);
        // Calculate unread count from the transformed notifications
        const unreadNotifications = transformedNotifications.filter(
          (n) => n.unread
        );
        if (!append) {
          setUnreadCount(unreadNotifications.length);
        }
        setPage(pageNum);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        // Fallback to mock data for development
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [user]
  ); // Added user as dependency since it affects the API endpoint

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `http://localhost:8080/notifications/${notificationId}/mark-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, unread: false }
            : notification
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Fallback for development
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, unread: false }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        `http://localhost:8080/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const deletedNotification = notifications.find(
        (n) => n.id === notificationId
      );
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );

      if (deletedNotification?.unread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      // Fallback for development
      const deletedNotification = notifications.find(
        (n) => n.id === notificationId
      );
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );

      if (deletedNotification?.unread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    }
  };

  // Load more notifications
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchNotifications(page + 1, true);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && notifications.length === 0) {
      fetchNotifications();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000);

    return () => clearInterval(interval);
  }, [user, fetchNotifications]); // Added both user and fetchNotifications as dependencies

  // Format time
  const formatTime = (timeString) => {
    const now = new Date();
    const time = new Date(timeString);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  return (
    <div className="notification-container" ref={dropdownRef}>
      <button
        className="notification-button"
        onClick={toggleDropdown}
        aria-label="Thông báo"
      >
        <svg
          className="notification-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.1-1.6-5.8-4-7.3V3c0-.6-.4-1-1-1h-2c-.6 0-1 .4-1 1v.7C7.6 5.2 6 7.9 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Thông báo</h3>
            <span className="notification-count">
              {unreadCount > 0 ? `${unreadCount} mới` : "Tất cả đã đọc"}
            </span>
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">
                <div className="loading-spinner"></div>
                <p>Đang tải thông báo...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <svg
                  className="empty-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.1-1.6-5.8-4-7.3V3c0-.6-.4-1-1-1h-2c-.6 0-1 .4-1 1v.7C7.6 5.2 6 7.9 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
                <p>Không có thông báo nào</p>
              </div>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`notification-item ${
                      notification.unread ? "unread" : ""
                    }`}
                    onClick={() =>
                      notification.unread && markAsRead(notification.id)
                    }
                  >
                    <div className="notification-content">
                      <div className="notification-text">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                      </div>
                      <div className="notification-meta">
                        <span className="notification-time">
                          {formatTime(notification.time)}
                        </span>
                        <div className="notification-actions">
                          {notification.unread && (
                            <button
                              className="mark-read-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              title="Đánh dấu đã đọc"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          <button
                            className="delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            title="Xóa thông báo"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    {notification.unread && (
                      <span className="unread-indicator"></span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {notifications.length > 0 && hasMore && (
            <div className="notification-load-more">
              <button
                className="load-more-btn"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <div className="loading-spinner small"></div>
                    Đang tải...
                  </>
                ) : (
                  "Tải thêm"
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notification;
