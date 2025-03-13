import React from "react";
import { BrowserRouter } from "react-router-dom";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./components/HomePage";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AuthPage from "./components/Auth/AuthPage";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <AuthPage />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
