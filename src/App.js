import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./components/HomePage";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AuthPage from "./components/Auth/AuthPage";

function App() {
  return (
    <div>
      <Header />
      <AuthPage />
      <Footer />
    </div>
  );
}

export default App;
