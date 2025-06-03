import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import ProductPage from "./pages/ProductDetailPage/ProductPage";
import CategoryDetail from "./pages/CategoryDetail/CategoryDetail";
import ScrollToTop from "./components/ScrollToTop";
import SignIn from "./pages/Auth/SignIn/SignIn";
import SignUp from "./pages/Auth/SignUp/SignUp";
import ShoppingCart from "./pages/Cart/ShoppingCart";
import Order from "./pages/OrderPage/Order";
import Information from "./pages/Information/Information";
import Admin from "./pages/Admin/Admin";
import Customer from "./pages/Admin/Customer/Customer";
import Invoice from "./pages/Admin/Invoice/Invoice";
import ForgotPassword from "./pages/Auth/ForgotPassword/ForgotPassword";
import BookManagement from "./pages/Admin/BookManagement/BookManagement";
import Category from "./pages/Admin/Category/Category";
import SearchResults from "./pages/SearchResults/SearchResults";
import Publisher from "./pages/Admin/Publisher/Publisher";
import Distributor from "./pages/Admin/Distributor/Distributor";
import ReviewManagement from "./pages/Admin/ReviewManagement/ReviewManagement";
import PaymentCallback from "./pages/PaymentCallback/PaymentCallback";
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/category/:id" element={<CategoryDetail />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/information" element={<Information />} />
        <Route path="/admin/customers" element={<Customer />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/invoices" element={<Invoice />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/books" element={<BookManagement />} />
        <Route path="/admin/categories" element={<Category />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/admin/publishers" element={<Publisher />} />
        <Route path="/admin/distributors" element={<Distributor />} />
        <Route path="/admin/reviews" element={<ReviewManagement />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
