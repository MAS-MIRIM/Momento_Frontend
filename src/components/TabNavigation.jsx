import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";

import HomeIcon from "../assets/icons/home.svg";
import ClockIcon from "../assets/icons/clock.svg";
import CalenderIcon from "../assets/icons/calender.svg";
import ProfileIcon from "../assets/icons/profile.svg";

const TAB_HEIGHT = 92;
const ACTIVE = "#05BAAE";
const INACTIVE = "#999999";

const TabNavigation = () => {
  const location = useLocation();

  const getFilter = (isActive) =>
    isActive
      ? "invert(53%) sepia(81%) saturate(407%) hue-rotate(128deg) brightness(94%) contrast(92%)"
      : "grayscale(1)";

  return (
    <BottomTabWrap>
      <TabItem to="/" $isActive={location.pathname === "/"}>
        <IconWrap>
          <img
            src={HomeIcon}
            alt="home"
            width={24}
            height={24}
            style={{ filter: getFilter(location.pathname === "/") }}
          />
        </IconWrap>
        <Label $active={location.pathname === "/"}>Home</Label>
      </TabItem>

      <TabItem
        to="/clock"
        $isActive={location.pathname.startsWith("/shortpick")}
      >
        <IconWrap>
          <img
            src={ClockIcon}
            alt="clock"
            width={24}
            height={24}
            style={{
              filter: getFilter(location.pathname.startsWith("/Timetable")),
            }}
          />
        </IconWrap>
        <Label $active={location.pathname.startsWith("/Timetable")}>
          Clock
        </Label>
      </TabItem>

      <TabItem to="/" $isActive={location.pathname.startsWith("/Calender")}>
        <IconWrap>
          <img
            src={CalenderIcon}
            alt="Calender"
            width={24}
            height={24}
            style={{
              filter: getFilter(location.pathname.startsWith("/Calender")),
            }}
          />
        </IconWrap>
        <Label $active={location.pathname.startsWith("/Calender")}>
          Calender
        </Label>
      </TabItem>

      <TabItem to="/" $isActive={location.pathname.startsWith("/Profile")}>
        <IconWrap>
          <img
            src={ProfileIcon}
            alt="Profile"
            width={24}
            height={24}
            style={{
              filter: getFilter(location.pathname.startsWith("/Profile")),
            }}
          />
        </IconWrap>
        <Label $active={location.pathname.startsWith("/Profile")}>
          Profile
        </Label>
      </TabItem>
    </BottomTabWrap>
  );
};

export default TabNavigation;

const BottomTabWrap = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
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

const activeCss = css`
  color: ${ACTIVE};
`;

const TabItem = styled(NavLink)`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  text-decoration: none;
  color: ${INACTIVE};
  gap: 4px;
  ${(p) => (p.$isActive ? activeCss : undefined)}
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
`;

const Label = styled.span`
  font-size: 12px;
  margin-top: 4px;
  ${(p) => (p.$active ? `color: ${ACTIVE};` : `color: ${INACTIVE};`)}
`;
