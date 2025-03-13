import React, { useState } from "react";
import LoginForm from "./SignIn/SignIn";
import RegisterForm from "./SignUp/SignUp";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? (
        <LoginForm onSwitch={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitch={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default AuthPage;
