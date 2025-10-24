import React, { useState } from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";
import bell from "../assets/bell.png";
import TabNavigation from "../components/TabNavigation";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Header = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 52px 12px;
  margin-bottom: 30px;
`;

const Logo = styled.img`
  width: 120px;
  height: auto;
`;

const Bell = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const TabSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => (props.active ? "#2d3436" : "#f0f0f0")};
  color: ${(props) => (props.active ? "#fff" : "#636e72")};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  transition: all 0.2s;

  &:hover {
    background-color: #2d3436;
    color: #fff;
  }
`;

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("ALL");

  const tabs = [
    "오늘 할 일",
    "오늘 할 일",
    "오늘 할 일",
    "오늘 할 일",
    "오늘 할 일",
    "오늘 할 일",
  ];

  return (
    <Container>
      <Header>
        <Logo src={logo} alt="logo" />
        <Bell src={bell} alt="notifications" />
      </Header>

      <TabSection>
        <TabContainer>
          {tabs.map((tab) => (
            <Tab
              key={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Tab>
          ))}
        </TabContainer>
      </TabSection>
      <TabNavigation />
    </Container>
  );
};

export default HomePage;
