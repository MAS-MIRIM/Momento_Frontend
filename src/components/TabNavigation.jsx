import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import HomeIcon from "../assets/icons/home.svg";
import ClockIcon from "../assets/icons/clock.svg";
import CalenderIcon from "../assets/icons/calender.svg";
import ProfileIcon from "../assets/icons/profile.svg";
import StudentIcon from "../assets/icons/student.svg";
import { useAuth } from "../contexts/AuthContext.jsx";

const TAB_HEIGHT = 92;

const BottomTabWrap = styled.nav`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 12px;
  height: ${TAB_HEIGHT}px;
  padding: 12px 24px calc(28px + env(safe-area-inset-bottom, 0px));
  background-color: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(245, 245, 245, 0.8);
  box-shadow: 0 -12px 32px rgba(17, 17, 17, 0.08);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: end;
  z-index: 1000;
`;

const Pill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 9999px;
  padding: 10px 10px;
  background: transparent;
  transition: background-color 0.25s ease, padding 0.25s ease,
    box-shadow 0.25s ease;
`;

const Label = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #05baae;
  white-space: nowrap;
  overflow: hidden;
  max-width: 0;
  opacity: 0;
  transform: translateX(-6px);
  transition: max-width 0.35s ease, opacity 0.25s ease, transform 0.35s ease;
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
`;

const TabItem = styled(NavLink)`
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  text-decoration: none;

  &.active ${Pill} {
    background: #daf2f0;
    padding: 10px 20px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  }

  &.active ${Label} {
    max-width: 120px;
    opacity: 1;
    transform: translateX(0);
  }
`;

const TabNavigation = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";

  const tabs = [
    {
      key: "home",
      to: "/home",
      label: "Home",
      icon: HomeIcon,
      end: true,
    },
    isTeacher
      ? {
          key: "students",
          to: "/students",
          label: "Student",
          icon: StudentIcon,
        }
      : {
          key: "clock",
          to: "/Timetable",
          label: "Clock",
          icon: ClockIcon,
        },
    {
      key: "calendar",
      to: "/calendar",
      label: "Calendar",
      icon: CalenderIcon,
      end: true,
    },
    {
      key: "profile",
      to: "/profile",
      label: "Profile",
      icon: ProfileIcon,
    },
  ];

  return (
    <BottomTabWrap>
      {tabs.map((tab) => (
        <TabItem
          key={tab.key}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <Pill>
            <IconWrap>
              <img
                src={tab.icon}
                alt={tab.label.toLowerCase()}
                width={24}
                height={24}
              />
            </IconWrap>
            <Label>{tab.label}</Label>
          </Pill>
        </TabItem>
      ))}
    </BottomTabWrap>
  );
};

export default TabNavigation;
