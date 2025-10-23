import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import LoginScreen from "./pages/LoginPage";
import SignUpScreen from "./pages/SignupPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeRoute />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/signup" element={<SignUpRoute />} />
      </Routes>
    </BrowserRouter>
  );
};

const WelcomeRoute = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <Welcome
        onSignUp={() => navigate("/signup")}
        onLogin={() => navigate("/login")}
      />
    </div>
  );
};

const LoginRoute = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <LoginScreen
        onLoginSuccess={() => navigate("/")}
        onSignUpPress={() => navigate("/signup")}
      />
    </div>
  );
};

const SignUpRoute = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <SignUpScreen
        onSignUpSuccess={() => navigate("/login")}
        onLoginPress={() => navigate("/login")}
      />
    </div>
  );
};

export default App;
