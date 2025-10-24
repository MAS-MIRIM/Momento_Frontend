import React from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import StudentHomePage from "./StudentHomePage.jsx";
import TeacherHomePage from "./TeacherHomePage.jsx";

const HomePage = () => {
  const { user } = useAuth();

  if (!user) {
    // Or a loading spinner
    return null;
  }

  return user.role === "teacher" ? <TeacherHomePage /> : <StudentHomePage />;
};

export default HomePage;