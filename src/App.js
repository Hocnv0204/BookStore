import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AuthPage from "./pages/Auth/AuthPage";
import ProductPage from "./pages/ProductDetailPage/ProductPage";
import CategoryDetail from "./pages/CategoryDetail/CategoryDetail";
import ScrollToTop from "./components/ScrollToTop";
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/category/:id" element={<CategoryDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
