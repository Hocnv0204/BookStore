// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import authService, { axiosInstance } from "../service/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken && !authService.isTokenExpired(accessToken)) {
          // Lấy thông tin user nếu đã đăng nhập
          const userInfo = await axiosInstance.get("/auth/me");
          setUser(userInfo.data);
        }
      } catch (error) {
        // Xóa token nếu có lỗi
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
