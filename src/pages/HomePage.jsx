import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import TabNavigation from "../components/TabNavigation";
import { useAuth } from "../contexts/AuthContext.jsx";
import ApiService from "../services/api.js";

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

const CharacterImage = styled.img`
  width: 72px;
  height: 72px;
  object-fit: contain;
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

const MissionRight = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const DoneBadge = styled.span`
  font-size: 12px;
  color: #8aa6a1;
`;

const MissionDescription = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: #6b7280;
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

const SectionHelper = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  color: #7a8a88;
`;


const HomePage = () => {
  const { token } = useAuth();

  const [classInfo, setClassInfo] = useState({
    loading: false,
    error: "",
    coin: null,
    image: "",
    name: "",
  });

  const [missions, setMissions] = useState([]);
  const [missionsLoading, setMissionsLoading] = useState(false);
  const [missionsError, setMissionsError] = useState("");
  const [completingId, setCompletingId] = useState(null);
  const [missionMessage, setMissionMessage] = useState("");

  const [notices] = useState([
    "내일 과학 수행평가 준비물 확인하세요.",
    "독서주간 행사 신청 마감 D-1.",
    "10/30(목) 6교시 학년 체육대회 예행연습",
  ]);

  const fetchClassCharacter = useCallback(() => {
    if (!token) return;
    setClassInfo((prev) => ({ ...prev, loading: true, error: "" }));

    ApiService.getClassCharacter(token)
      .then((data) => {
        setClassInfo({
          loading: false,
          error: "",
          coin: data?.coin ?? null,
          image: data?.image ?? "",
          name: data?.name ?? "",
        });
      })
      .catch((error) => {
        console.error("Failed to fetch class character", error);
        setClassInfo({
          loading: false,
          error:
            error?.data?.message ||
            error?.message ||
            "반 캐릭터 정보를 불러오지 못했습니다.",
          coin: null,
          image: "",
          name: "",
        });
      });
  }, [token]);

  const fetchMissions = useCallback(() => {
    if (!token) return;
    setMissionsLoading(true);
    setMissionsError("");
    setMissionMessage("");

    ApiService.getDailyMissions(token)
      .then((data) => {
        const fetched = Array.isArray(data?.missions) ? data.missions : [];
        setMissions(
          fetched.map((mission) => ({
            id: mission.id,
            title: mission.title,
            description: mission.description,
            missionType: mission.missionType || "regular",
            completed: Boolean(mission.completed),
          }))
        );
        if (data?.message) {
          setMissionMessage(data.message);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch missions", error);
        setMissionsError(
          error?.data?.message ||
            error?.message ||
            "미션을 불러오지 못했습니다."
        );
        setMissions([]);
      })
      .finally(() => {
        setMissionsLoading(false);
      });
  }, [token]);

  const handleCompleteMission = useCallback(
    async (mission) => {
      if (!token || mission.completed) return;

      setCompletingId(mission.id);
      setMissionMessage("");

      try {
        const result = await ApiService.completeMission(token, {
          missionId: mission.id,
          missionType: mission.missionType || "regular",
        });

        setMissions((prev) =>
          prev.map((item) =>
            item.id === mission.id ? { ...item, completed: true } : item
          )
        );

        const parts = [];
        if (typeof result?.coinDelta === "number") {
          const delta = result.coinDelta;
          parts.push(`코인 ${delta > 0 ? "+" : ""}${delta}`);
        }
        if (result?.bonusGranted) {
          parts.push("보너스 지급");
        }
        if (result?.message) {
          parts.push(result.message);
        }
        if (parts.length === 0) {
          parts.push("미션을 완료했습니다!");
        }
        setMissionMessage(parts.join(" · "));

        fetchClassCharacter();
        fetchMissions();
      } catch (error) {
        console.error("Failed to complete mission", error);
        setMissionMessage(
          error?.data?.message ||
            error?.message ||
            "미션 완료 처리에 실패했습니다."
        );
      } finally {
        setCompletingId(null);
      }
    },
    [token, fetchClassCharacter, fetchMissions]
  );

  useEffect(() => {
    if (!token) return;
    fetchClassCharacter();
  }, [token, fetchClassCharacter]);

  useEffect(() => {
    if (!token) return;
    fetchMissions();
  }, [token, fetchMissions]);

  const completedMissions = useMemo(
    () => missions.filter((mission) => mission.completed).length,
    [missions]
  );
  const remainingMissions = Math.max(0, missions.length - completedMissions);

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
        <Title>우리 반 캐릭터</Title>
        {classInfo.loading ? (
          <SectionHelper>반 캐릭터 정보를 불러오는 중입니다...</SectionHelper>
        ) : classInfo.error ? (
          <SectionHelper>{classInfo.error}</SectionHelper>
        ) : (
          <LevelWrap>
            <LevelTop>
              <LevelName>현재 코인</LevelName>
              <LevelXp>
                {classInfo.coin !== null
                  ? `${classInfo.coin} 코인`
                  : "정보 없음"}
              </LevelXp>
            </LevelTop>

            <CharacterCard>
              {classInfo.image ? (
                <CharacterImage src={classInfo.image} alt="반 캐릭터" />
              ) : (
                <CharEmoji role="img" aria-label="class character">
                  🏫
                </CharEmoji>
              )}
              <CharDesc>
                오늘 미션을 완료하면 반 코인이 올라가고 캐릭터가 성장해요!
              </CharDesc>
            </CharacterCard>

            <SummaryRow>
              <SummaryCard>
                <SummaryTitle>남은 미션</SummaryTitle>
                <SummaryValue>{remainingMissions}개</SummaryValue>
              </SummaryCard>
              <SummaryCard>
                <SummaryTitle>완료된 미션</SummaryTitle>
                <SummaryValue>{completedMissions}개</SummaryValue>
              </SummaryCard>
            </SummaryRow>
          </LevelWrap>
        )}
      </Section>

      <Section>
        <Title>미션 리스트</Title>
        {missionsLoading ? (
          <SectionHelper>미션을 불러오는 중입니다...</SectionHelper>
        ) : missionsError ? (
          <SectionHelper>{missionsError}</SectionHelper>
        ) : missions.length > 0 ? (
          <MissionList>
            {missions.map((mission) => (
              <MissionRow key={mission.id}>
                <div>
                  <MissionTitle>{mission.title}</MissionTitle>
                  {mission.description && (
                    <MissionDescription>{mission.description}</MissionDescription>
                  )}
                </div>
                <MissionRight>
                  {mission.completed ? (
                    <DoneBadge>완료됨</DoneBadge>
                  ) : (
                    <PrimaryBtn
                      onClick={() => handleCompleteMission(mission)}
                      disabled={mission.completed || completingId === mission.id}
                    >
                      {completingId === mission.id ? "처리 중..." : "완료"}
                    </PrimaryBtn>
                  )}
                </MissionRight>
              </MissionRow>
            ))}
          </MissionList>
        ) : (
          <SectionHelper>오늘 할 미션이 없습니다.</SectionHelper>
        )}
        {missionMessage && <SectionHelper>{missionMessage}</SectionHelper>}
      </Section>

      <div style={{ height: 92 }} />
      <TabNavigation />
    </Container>
  );
};

export default HomePage;
