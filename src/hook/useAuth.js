import { useState, useEffect } from "react";
import authService from "../service/authService";
import axiosInstance from "./axiosInstance";
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken && !authService.isTokenExpired(accessToken)) {
          // Nếu có access token và chưa hết hạn
          // Có thể gọi API để lấy thông tin user
          const userInfo = await axiosInstance.get("/auth/me");
          setUser(userInfo.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Token không hợp lệ hoặc có lỗi khác
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, user, loading };
};
