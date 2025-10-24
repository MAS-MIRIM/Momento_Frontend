import React, { useMemo, useState } from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";
import TabNavigation from "../components/TabNavigation";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 20px;
`;

const Header = styled.header`
  width: 100%;
  max-width: 960px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 8px;
`;

const Logo = styled.img`
  width: 120px;
  height: auto;
`;

const ClassLine = styled.div`
  margin-top: 18px;
  font-size: 20px;
  font-weight: 700;
  color: #111;
`;

const DateBar = styled.div`
  width: 100%;
  max-width: 960px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
`;

const DateBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: #ffffff;
  color: #05baae;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.05s ease;
  &:hover {
    background: #f6fbfa;
  }
  &:active {
    transform: translateY(1px);
  }
`;

const DateText = styled.div`
  font-size: 16px;
  color: #333;
  min-width: 220px;
  text-align: center;
`;

const TimetableWrap = styled.div`
  width: 100%;
  max-width: 960px;
  margin-top: 14px;
  padding: 0 8px;
`;

const PeriodRow = styled.div`
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #eef4f3;
  & + & {
    margin-top: 8px;
  }
`;

const PeriodBadge = styled.div`
  height: 32px;
  border-radius: 9999px;
  background: #daf2f0;
  color: #008f86;
  font-size: 14px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Subject = styled.div`
  font-size: 15px;
  color: #0b3b38;
  font-weight: 600;
`;

const LunchSection = styled.section`
  width: 100%;
  max-width: 960px;
  margin-top: 16px;
  padding: 0 8px 90px;
`;

const LunchTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 800;
  color: #111;
`;

const LunchBar = styled.div`
  display: grid;
  grid-template-columns: 36px 1fr 36px;
  align-items: center;
  gap: 8px;
`;

const LunchBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: #ffffff;
  color: #05baae;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.05s ease;
  &:hover {
    background: #f6fbfa;
  }
  &:active {
    transform: translateY(1px);
  }
`;

const LunchItem = styled.div`
  height: 44px;
  border: 1px solid #eef4f3;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0b3b38;
  font-size: 15px;
  font-weight: 700;
`;

const BottomPad = styled.div`
  height: 92px;
`;

function fmtKoreanDate(d) {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const w = weekdays[d.getDay()];
  return `${y}년 ${m}월 ${day}일 (${w})`;
}

const EXAMPLE_TABLE = {
  1: ["국어", "수학", "체육", "영어", "과학", "음악", "자율"],
  2: ["사회", "수학", "미술", "국어", "영어", "과학", "창체"],
  3: ["국어", "수학", "영어", "사회", "체육", "과학", "동아리"],
  4: ["수학", "국어", "과학", "영어", "사회", "기술가정", "창체"],
  5: ["영어", "과학", "사회", "수학", "국어", "체육", "자율"],
  6: ["자율", "자율", "자율", "자율", "자율", "자율", "자율"],
  0: ["국어 보충", "수학 보충", "영어 보충", "자습", "자습", "자습", "자율"],
};

const EXAMPLE_LUNCH = [
  "잡곡밥 + 김치",
  "돈까스 + 샐러드",
  "카레라이스",
  "비빔밥",
  "짜장밥 + 단무지",
];

const TimetablePage = () => {
  const [grade, setGrade] = useState(2);
  const [klass, setKlass] = useState(2);
  const [date, setDate] = useState(new Date(2025, 9, 24));
  const [lunchIdx, setLunchIdx] = useState(0);

  const weekday = date.getDay();
  const timetable = useMemo(() => EXAMPLE_TABLE[weekday] || [], [weekday]);

  const goPrevDate = () => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    setDate(d);
  };
  const goNextDate = () => {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    setDate(d);
  };

  const prevLunch = () =>
    setLunchIdx((i) => (i - 1 + EXAMPLE_LUNCH.length) % EXAMPLE_LUNCH.length);
  const nextLunch = () => setLunchIdx((i) => (i + 1) % EXAMPLE_LUNCH.length);

  return (
    <Container>
      <Header>
        <Logo src={logo} alt="logo" />
      </Header>

      <ClassLine>
        {grade}학년 {klass}반
      </ClassLine>

      <DateBar>
        <DateBtn onClick={goPrevDate}>‹</DateBtn>
        <DateText>{fmtKoreanDate(date)}</DateText>
        <DateBtn onClick={goNextDate}>›</DateBtn>
      </DateBar>

      <TimetableWrap>
        {timetable.map((subj, idx) => (
          <PeriodRow key={idx}>
            <PeriodBadge>{idx + 1}교시</PeriodBadge>
            <Subject>{subj}</Subject>
          </PeriodRow>
        ))}
      </TimetableWrap>

      <LunchSection>
        <LunchTitle>중식</LunchTitle>
        <LunchBar>
          <LunchBtn onClick={prevLunch}>‹</LunchBtn>
          <LunchItem>{EXAMPLE_LUNCH[lunchIdx]}</LunchItem>
          <LunchBtn onClick={nextLunch}>›</LunchBtn>
        </LunchBar>
      </LunchSection>

      <BottomPad />
      <TabNavigation />
    </Container>
  );
};

export default TimetablePage;
