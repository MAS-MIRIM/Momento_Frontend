import styled from "styled-components";
import TabNavigation from "../components/TabNavigation";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 40px 20px 140px;
  position: relative;
  gap: 24px;
`;

const Title = styled.h1`
  margin: 0;
  margin-top: 24px;
  font-size: 24px;
  font-weight: 700;
  color: #111111;
`;

const Description = styled.p`
  margin: 0;
  font-size: 16px;
  color: #666666;
  text-align: center;
  line-height: 1.5;
`;

const ClockPage = () => {
  return (
    <Container>
      <Title>시간표</Title>
      <Description>곧 새로운 시간표 기능을 만나보실 수 있어요.</Description>
      <TabNavigation />
    </Container>
  );
};

export default ClockPage;
