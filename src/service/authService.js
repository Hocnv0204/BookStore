import axios from "axios";

const API_URL = "http://localhost:8080/";

// Tạo một instance axios riêng để xử lý token
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để kiểm tra token trước mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý các response lỗi
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra nếu lỗi 401 (Unauthorized) và chưa thử refresh token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken: refreshToken,
        });

        // Lưu token mới vào localStorage
        const { accessToken, newRefreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        // Tuỳ chọn: cập nhật luôn refresh token nếu server trả về
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Cập nhật token trong header và gửi lại request ban đầu
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token cũng hết hạn hoặc không hợp lệ
        // Đăng xuất người dùng
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // Chuyển hướng về trang đăng nhập
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Các hàm xử lý auth
const authService = {
  login: async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });

    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  // Hàm kiểm tra token còn hạn hay không (tuỳ chọn)
  isTokenExpired: (token) => {
    if (!token) return true;

    try {
      // Giải mã phần payload của JWT (phần thứ 2 sau dấu .)
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Kiểm tra thời gian hết hạn
      return payload.exp < Date.now() / 1000;
    } catch (e) {
      return true;
    }
  },
};

// Export các thành phần cần thiết
export { axiosInstance };
export default authService;
