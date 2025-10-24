import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import LoginScreen from "./pages/LoginPage";
import SignUpScreen from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import ClockPage from "./pages/ClockPage";
import TimetablePage from "./pages/TimetablePage";
import ProfilePage from "./pages/ProfilePage";
import StudentPage from "./pages/StudentPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeRoute />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/signup" element={<SignUpRoute />} />
        <Route path="/home" element={<HomeRoute />} />
        <Route path="/calendar" element={<CalendarRoute />} />
        <Route path="/clock" element={<ClockRoute />} />
        <Route path="/timetable" element={<TimetableRoute />} />
        <Route path="/profile" element={<ProfileRoute />} />
        <Route path="/students" element={<StudentRoute />} />
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
        onSignUpSuccess={() => navigate("/home")}
        onLoginPress={() => navigate("/login")}
      />
    </div>
  );
};

const HomeRoute = () => {
  return (
    <div className="app-container">
      <HomePage />
    </div>
  );
};

const CalendarRoute = () => {
  return (
    <div className="app-container">
      <CalendarPage />
    </div>
  );
};

const ClockRoute = () => {
  return (
    <div className="app-container">
      <ClockPage />
    </div>
  );
};

const TimetableRoute = () => {
  return (
    <div className="app-container">
      <TimetablePage />
    </div>
  );
};

const ProfileRoute = () => {
  return (
    <div className="app-container">
      <ProfilePage />
    </div>
  );
};

const StudentRoute = () => {
  return (
    <div className="app-container">
      <StudentPage />
    </div>
  );
};

export default App;
