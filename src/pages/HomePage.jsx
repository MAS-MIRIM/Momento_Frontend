import React, { useMemo, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
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

const Section = styled.section`
  width: 100%;
  max-width: 960px;
`;

const Title = styled.h3`
  margin: 18px 0 10px;
  font-size: 18px;
  font-weight: 800;
  color: #111;
`;

const NoticeCard = styled.div`
  border: 1px solid #eef4f3;
  border-radius: 12px;
  padding: 12px;
  background: #ffffff;
`;

const NoticeItem = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  color: #0b3b38;
  font-size: 14px;
  & + & {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px dashed #e8efed;
  }
`;

const Dot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-top: 7px;
  border-radius: 50%;
  background: #05baae;
  flex: 0 0 auto;
`;

const LevelWrap = styled.div`
  border: 1px solid #eef4f3;
  border-radius: 16px;
  padding: 14px;
  background: #ffffff;
`;

const LevelTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
`;

const LevelName = styled.div`
  font-weight: 900;
  color: #0b3b38;
  font-size: 16px;
`;

const LevelXp = styled.div`
  font-weight: 700;
  color: #7a8a88;
  font-size: 12px;
`;

const Bar = styled.div`
  width: 100%;
  height: 12px;
  background: #f2fbfa;
  border: 1px solid #e6f3f1;
  border-radius: 9999px;
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  width: ${(p) => p.$ratio}%;
  background: linear-gradient(90deg, #05baae, #05a0a0);
  transition: width 0.3s ease;
`;

const CharacterCard = styled.div`
  margin-top: 12px;
  border: 1px solid #eef4f3;
  border-radius: 16px;
  background: #ffffff;
  padding: 16px;
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 12px;
  align-items: center;
`;

const CharEmoji = styled.div`
  font-size: 48px;
  line-height: 1;
  text-align: center;
`;

const CharDesc = styled.div`
  color: #0b3b38;
  font-size: 14px;
`;

const SummaryRow = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const SummaryCard = styled.div`
  border: 1px solid #eef4f3;
  border-radius: 12px;
  background: #ffffff;
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
`;

const SummaryTitle = styled.span`
  font-size: 14px;
  color: #7a8a88;
`;

const SummaryValue = styled.span`
  font-size: 16px;
  font-weight: 900;
  color: #008f86;
`;

const MissionList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MissionRow = styled.div`
  border: 1px solid #eef4f3;
  border-radius: 12px;
  background: #ffffff;
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
`;

const MissionTitle = styled.div`
  font-size: 14px;
  color: #0b3b38;
  font-weight: 700;
`;

const Reward = styled.span`
  font-size: 12px;
  color: #05baae;
  font-weight: 800;
  background: #f2fbfa;
  padding: 4px 8px;
  border-radius: 9999px;
  margin-left: 8px;
`;

const MissionRight = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const DoneBadge = styled.span`
  font-size: 12px;
  color: #8aa6a1;
`;

const PrimaryBtn = styled.button`
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
  background: #05baae;
  color: #fff;
  &:disabled {
    background: #bfe9e4;
    cursor: not-allowed;
  }
`;

const HomePage = () => {
  const [coins, setCoins] = useState(120);
  const [xp, setXp] = useState(230); // 누적 경험치
  const [level, setLevel] = useState(3);

  const [notices] = useState([
    "내일 과학 수행평가 준비물 확인하세요.",
    "독서주간 행사 신청 마감 D-1.",
    "10/30(목) 6교시 학년 체육대회 예행연습",
  ]);

  const [missions, setMissions] = useState([
    { id: 1, title: "수학 문제집 2단원 풀기", reward: 10, done: false },
    { id: 2, title: "영어 단어 20개 암기", reward: 8, done: false },
    { id: 3, title: "국어 수행발표 자료 만들기", reward: 15, done: true },
    { id: 4, title: "과학 보고서 초안 작성", reward: 12, done: false },
  ]);

  const levelName = useMemo(() => {
    if (level >= 5) return "마스터";
    if (level >= 3) return "에이스";
    if (level >= 2) return "도전자";
    return "루키";
  }, [level]);

  const characterEmoji = useMemo(() => {
    if (level >= 5) return "🐉";
    if (level >= 3) return "🦊";
    if (level >= 2) return "🐥";
    return "🐣";
  }, [level]);

  const xpInLevel = xp % 100;
  const progress = Math.min(100, (xpInLevel / 100) * 100);

  const completeMission = (id) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, done: true } : m))
    );
    const m = missions.find((m) => m.id === id);
    if (m && !m.done) {
      setCoins((c) => c + m.reward);
      setXp((x) => {
        const nx = x + m.reward * 2; // 보상에 따라 경험치 가중
        const newLevel = Math.floor(nx / 100) + 1;
        setLevel(newLevel);
        return nx;
      });
    }
  };

  return (
    <Container>
      <Header />

      <Section>
        <Title>공지</Title>
        <NoticeCard>
          {notices.map((n, i) => (
            <NoticeItem key={i}>
              <Dot />
              <div>{n}</div>
            </NoticeItem>
          ))}
        </NoticeCard>
      </Section>

      <Section>
        <Title>레벨</Title>
        <LevelWrap>
          <LevelTop>
            <LevelName>
              {levelName} Lv.{level}
            </LevelName>
            <LevelXp>{xpInLevel}/100 XP</LevelXp>
          </LevelTop>
          <Bar>
            <Fill $ratio={progress} />
          </Bar>

          <CharacterCard>
            <CharEmoji>{characterEmoji}</CharEmoji>
            <CharDesc>
              현재 등급은 <b>{levelName}</b>이에요. 미션을 완료해서 경험치를 더
              모아보세요!
            </CharDesc>
          </CharacterCard>

          <SummaryRow>
            <SummaryCard>
              <SummaryTitle>미션</SummaryTitle>
              <SummaryValue>
                {missions.filter((m) => !m.done).length}개 남음
              </SummaryValue>
            </SummaryCard>
            <SummaryCard>
              <SummaryTitle>코인</SummaryTitle>
              <SummaryValue>{coins} 코인</SummaryValue>
            </SummaryCard>
          </SummaryRow>
        </LevelWrap>
      </Section>

      <Section>
        <Title>미션 리스트</Title>
        <MissionList>
          {missions.map((m) => (
            <MissionRow key={m.id}>
              <div>
                <MissionTitle>
                  {m.title}
                  <Reward>+{m.reward}c</Reward>
                </MissionTitle>
              </div>
              <MissionRight>
                {m.done ? (
                  <DoneBadge>완료됨</DoneBadge>
                ) : (
                  <PrimaryBtn onClick={() => completeMission(m.id)}>
                    완료
                  </PrimaryBtn>
                )}
              </MissionRight>
            </MissionRow>
          ))}
        </MissionList>
      </Section>

      <div style={{ height: 92 }} />
      <TabNavigation />
    </Container>
  );
};

export default HomePage;
