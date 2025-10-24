import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import LoginScreen from "./pages/LoginPage";
import SignUpScreen from "./pages/SignupPage";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeRoute />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/signup" element={<SignUpRoute />} />
        <Route path="/home" element={<HomeRoute />} />
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
        onLoginSuccess={() => navigate("/home")}
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
        onLoginSuccess={() => navigate("/home")}
        onLoginPress={() => navigate("/login")}
      />
    </div>
  );
};

const HomeRoute = () => {
  return (
    <div className="app-container">
      <HomePage />;
    </div>
  );
};

export default App;
