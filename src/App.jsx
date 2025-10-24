import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Welcome from "./pages/Welcome";
import LoginScreen from "./pages/LoginPage";
import SignUpScreen from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import TimetablePage from "./pages/TimetablePage";
import ProfilePage from "./pages/ProfilePage";
import StudentPage from "./pages/StudentPage";
import StudentRecordPage from "./pages/StudentRecordPage";
import styled, { keyframes } from "styled-components";

// 오른쪽에서 슬라이드 인 (push)
const slideInFromRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

// 왼쪽으로 슬라이드 아웃 (push)
const slideOutToLeft = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-30%);
    opacity: 0.7;
  }
`;

// 왼쪽에서 슬라이드 인 (pop/back)
const slideInFromLeft = keyframes`
  from {
    transform: translateX(-30%);
    opacity: 0.7;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// 오른쪽으로 슬라이드 아웃 (pop/back)
const slideOutToRight = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
`;

// 애니메이션 래퍼
const PageTransition = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  animation: ${({ $direction, $isExiting }) => {
      if ($isExiting) {
        return $direction === "forward" ? slideOutToLeft : slideOutToRight;
      }
      return $direction === "forward" ? slideInFromRight : slideInFromLeft;
    }}
    0.35s cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: forwards;
`;

const TransitionContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

// 라우트 깊이 정의 (숫자가 클수록 더 깊은 페이지)
const routeDepth = {
  "/": 0,
  "/login": 1,
  "/signup": 1,
  "/home": 2,
  "/calendar": 2,
  "/timetable": 2,
  "/profile": 2,
  "/students": 2,
  "/student-record": 3,
};

// 페이지 전환을 관리하는 래퍼 컴포넌트
const AnimatedPage = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("idle");
  const [direction, setDirection] = useState("forward");

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      // 라우트 깊이 비교하여 방향 결정
      const currentDepth = routeDepth[displayLocation.pathname] || 0;
      const nextDepth = routeDepth[location.pathname] || 0;
      const isForward = nextDepth > currentDepth;

      setDirection(isForward ? "forward" : "backward");
      setTransitionStage("exiting");

      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("entering");

        setTimeout(() => {
          setTransitionStage("idle");
        }, 350);
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <TransitionContainer>
      {transitionStage !== "idle" && (
        <PageTransition
          $direction={direction}
          $isExiting={transitionStage === "exiting"}
          key={displayLocation.pathname}
        >
          {children}
        </PageTransition>
      )}
      {transitionStage === "idle" && (
        <div style={{ width: "100%", height: "100%" }}>{children}</div>
      )}
    </TransitionContainer>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeRoute />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/signup" element={<SignUpRoute />} />
        <Route path="/home" element={<HomeRoute />} />
        <Route path="/calendar" element={<CalendarRoute />} />
        <Route path="/timetable" element={<TimetableRoute />} />
        <Route path="/profile" element={<ProfileRoute />} />
        <Route path="/students" element={<StudentRoute />} />
        <Route path="/student-record" element={<StudentRecordRoute />} />
      </Routes>
    </BrowserRouter>
  );
};

const WelcomeRoute = () => {
  const navigate = useNavigate();
  return (
    <div className="app-container">
      <AnimatedPage>
        <Welcome
          onSignUp={() => navigate("/signup")}
          onLogin={() => navigate("/login")}
        />
      </AnimatedPage>
    </div>
  );
};

const LoginRoute = () => {
  const navigate = useNavigate();
  return (
    <div className="app-container">
      <AnimatedPage>
        <LoginScreen
          onLoginSuccess={() => navigate("/home")}
          onSignUpPress={() => navigate("/signup")}
        />
      </AnimatedPage>
    </div>
  );
};

const SignUpRoute = () => {
  const navigate = useNavigate();
  return (
    <div className="app-container">
      <AnimatedPage>
        <SignUpScreen
          onSignUpSuccess={() => navigate("/home")}
          onLoginPress={() => navigate("/login")}
        />
      </AnimatedPage>
    </div>
  );
};

const HomeRoute = () => {
  return (
    <div className="app-container">
      <AnimatedPage>
        <HomePage />
      </AnimatedPage>
    </div>
  );
};

const CalendarRoute = () => {
  return (
    <div className="app-container">
      <AnimatedPage>
        <CalendarPage />
      </AnimatedPage>
    </div>
  );
};

const TimetableRoute = () => {
  return (
    <div className="app-container">
      <AnimatedPage>
        <TimetablePage />
      </AnimatedPage>
    </div>
  );
};

const ProfileRoute = () => {
  return (
    <div className="app-container">
      <AnimatedPage>
        <ProfilePage />
      </AnimatedPage>
    </div>
  );
};

const StudentRoute = () => {
  return (
    <div className="app-container">
      <AnimatedPage>
        <StudentPage />
      </AnimatedPage>
    </div>
  );
};

const StudentRecordRoute = () => {
  return (
    <div className="app-container">
      <AnimatedPage>
        <StudentRecordPage />
      </AnimatedPage>
    </div>
  );
};

export default App;
