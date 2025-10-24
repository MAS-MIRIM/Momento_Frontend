import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import TabNavigation from "../components/TabNavigation";
import { useAuth } from "../contexts/AuthContext.jsx";
import ApiService from "../services/api.js";

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ScrollWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
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

const HeroCard = styled.div`
  border: 1px solid #eef4f3;
  border-radius: 20px;
  padding: 22px;
  background: linear-gradient(135deg, #f8fffe 0%, #ffffff 72%);
  box-shadow: 0 18px 36px rgba(5, 186, 174, 0.08);
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const HeroTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
`;

const HeroTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #053a37;
  line-height: 1.25;
`;

const HeroSubtitle = styled.p`
  margin: 6px 0 0;
  font-size: 14px;
  color: #4d6b67;
`;

const CoinBadge = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(5, 186, 174, 0.13);
  color: #008f86;
  font-weight: 800;
  font-size: 14px;
`;

const HeroMetaRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
`;

const HeroMetaItem = styled.div`
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid #e7f3f2;
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HeroMetaLabel = styled.span`
  font-size: 12px;
  color: #7aa7a1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const HeroMetaValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #0b3b38;
`;

const HeroActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
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

const MissionList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MissionRow = styled.div`
  border: 1px solid
    ${({ $completed, $type }) => {
      if ($completed) return "#d4e8e5";
      return $type === "emergency" ? "#ffd7d5" : "#eef4f3";
    }};
  border-radius: 12px;
  background: ${({ $completed, $type }) => {
    if ($completed) return "#f7fbfa";
    return $type === "emergency" ? "#fff5f5" : "#ffffff";
  }};
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
  opacity: ${({ $completed }) => ($completed ? 0.72 : 1)};
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

const SecondaryBtn = styled.button`
  border: 1px solid #d9efec;
  border-radius: 10px;
  padding: 8px 12px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  background: #ffffff;
  color: #05baae;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  &:hover {
    background: #f2fbfa;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MissionTypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ $variant }) =>
    $variant === "emergency" ? "#b42318" : "#0b7053"};
  background: ${({ $variant }) =>
    $variant === "emergency"
      ? "rgba(218, 38, 17, 0.12)"
      : "rgba(5, 186, 174, 0.12)"};
`;

const MissionMeta = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 6px;
  font-size: 12px;
  color: #6b7280;
`;

const MissionReward = styled.span`
  font-weight: 700;
  color: #008f86;
`;

const MissionFooter = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: #9aa7a5;
`;

const MessageBanner = styled.div`
  margin-top: 12px;
  border-radius: 12px;
  padding: 10px 12px;
  background: #f1fcfb;
  color: #0b3b38;
  border: 1px solid #d9efec;
  font-size: 13px;
`;

const PendingBadge = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 9999px;
  color: #d97706;
  background: #fef3c7;
  font-weight: 700;
`;

const SectionHelper = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  color: #7a8a88;
`;

const formatDeadline = (value) => {
  if (!value) return null;
  const deadline = new Date(value);
  if (Number.isNaN(deadline.getTime())) return null;
  const month = `${deadline.getMonth() + 1}`.padStart(2, "0");
  const day = `${deadline.getDate()}`.padStart(2, "0");
  const hours = `${deadline.getHours()}`.padStart(2, "0");
  const minutes = `${deadline.getMinutes()}`.padStart(2, "0");
  return `${deadline.getFullYear()}.${month}.${day} ${hours}:${minutes}`;
};

const missionTypeLabel = (type) =>
  type === "emergency" ? "긴급 미션" : "기본 미션";

const missionRewardText = (type) =>
  type === "emergency" ? "+3 코인 보상" : "+0.5 코인 · 하루 최대 2회";

const HomePage = () => {
  const { user, token } = useAuth();

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
  const [emergencyMissions, setEmergencyMissions] = useState([]);
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [emergencyError, setEmergencyError] = useState("");
  const [missionMessage, setMissionMessage] = useState("");

  const [notices] = useState([
    "내일 과학 수행평가 준비물 확인하세요.",
    "독서주간 행사 신청 마감 D-1.",
    "10/30(목) 6교시 학년 체육대회 예행연습",
  ]);

  const educationOfficeCode = user?.educationOfficeCode ?? null;
  const schoolCode = user?.schoolCode ?? null;

  const gradeValue = useMemo(() => {
    if (!user) return null;
    if (user.role === "student") return user.grade ?? null;
    return user.homeroomGrade ?? null;
  }, [user]);

  const classValue = useMemo(() => {
    if (!user) return null;
    if (user.role === "student") return user["class"] ?? null;
    return user.homeroomClass ?? null;
  }, [user]);

  const classLabel = useMemo(() => {
    const gradeLabel = gradeValue ? `${gradeValue}학년` : null;
    const classLabelValue = classValue ? `${classValue}반` : null;
    const joined = [gradeLabel, classLabelValue].filter(Boolean).join(" ");
    if (joined) return joined;
    if (!user) return "반 정보 없음";
    return user.role === "teacher" ? "담당 학급 없음" : "학생";
  }, [user, gradeValue, classValue]);

  const heroTitle = classInfo.name || "우리 반 캐릭터";
  const coinText = classInfo.loading
    ? "불러오는 중..."
    : classInfo.coin !== null
    ? `${classInfo.coin} 코인`
    : "코인 정보 없음";

  const anyMissionLoading = missionsLoading || emergencyLoading;
  const hasMissionError = Boolean(missionsError || emergencyError);

  const missionMetricText = (value) => {
    if (anyMissionLoading) return "불러오는 중";
    if (hasMissionError) return "표시 불가";
    return `${value}개`;
  };

  const fetchClassCharacter = useCallback(() => {
    if (!token) return;
    if (!educationOfficeCode || !schoolCode) {
      return;
    }

    if (!gradeValue || !classValue) {
      return;
    }

    setClassInfo((prev) => ({ ...prev, loading: true, error: "" }));

    ApiService.getClassCharacter(token, {
      educationOfficeCode,
      schoolCode,
      grade: gradeValue,
      classNumber: classValue,
    })
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
  }, [token, educationOfficeCode, schoolCode, gradeValue, classValue]);

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

  const fetchEmergencyMissions = useCallback(() => {
    if (!token) return;
    setEmergencyLoading(true);
    setEmergencyError("");

    ApiService.getEmergencyMissions(token)
      .then((data) => {
        const fetched = Array.isArray(data?.missions) ? data.missions : [];
        setEmergencyMissions(
          fetched.map((mission) => ({
            id: mission.id,
            title: mission.title,
            description: mission.description,
            deadline: mission.deadline,
            missionType: "emergency",
            classInfo: mission.classInfo || null,
            completed: Boolean(mission.completed),
          }))
        );
      })
      .catch((error) => {
        console.error("Failed to fetch emergency missions", error);
        setEmergencyError(
          error?.data?.message ||
            error?.message ||
            "긴급 미션을 불러오지 못했습니다."
        );
        setEmergencyMissions([]);
      })
      .finally(() => {
        setEmergencyLoading(false);
      });
  }, [token]);

  const handleRefresh = useCallback(() => {
    fetchClassCharacter();
    fetchMissions();
    fetchEmergencyMissions();
  }, [fetchClassCharacter, fetchMissions, fetchEmergencyMissions]);


  useEffect(() => {
    if (!token || !user) return;
    fetchClassCharacter();
  }, [token, user, fetchClassCharacter]);

  useEffect(() => {
    if (!token) return;
    fetchMissions();
  }, [token, fetchMissions]);

  useEffect(() => {
    if (!token) return;
    fetchEmergencyMissions();
  }, [token, fetchEmergencyMissions]);

  const completedRegularMissions = useMemo(
    () => missions.filter((mission) => mission.completed).length,
    [missions]
  );
  const completedEmergencyMissions = useMemo(
    () =>
      emergencyMissions.filter((mission) => mission.completed).length,
    [emergencyMissions]
  );
  const totalMissions = missions.length + emergencyMissions.length;
  const completedMissions =
    completedRegularMissions + completedEmergencyMissions;
  const remainingMissions = Math.max(0, totalMissions - completedMissions);

  return (
    <Container>
      <Header />
      <ScrollWrapper>
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
          <Title>우리 반 현황</Title>
        {!gradeValue || !classValue ? (
          <SectionHelper>
            학년과 반 정보가 없어 반 캐릭터를 표시할 수 없습니다.
          </SectionHelper>
        ) : classInfo.loading ? (
          <SectionHelper>반 캐릭터 정보를 불러오는 중입니다...</SectionHelper>
        ) : classInfo.error ? (
          <SectionHelper>{classInfo.error}</SectionHelper>
        ) : (
            <HeroCard>
              <HeroTop>
                <div>
                  <HeroTitle>{heroTitle}</HeroTitle>
                  <HeroSubtitle>
                    {user?.school ?? "학교 정보 없음"} · {classLabel}
                  </HeroSubtitle>
                </div>
                <CoinBadge>{coinText}</CoinBadge>
              </HeroTop>

              <HeroMetaRow>
                <HeroMetaItem>
                  <HeroMetaLabel>오늘 미션</HeroMetaLabel>
                  <HeroMetaValue>
                    {missionMetricText(totalMissions)}
                  </HeroMetaValue>
                </HeroMetaItem>
                <HeroMetaItem>
                  <HeroMetaLabel>완료</HeroMetaLabel>
                  <HeroMetaValue>
                    {missionMetricText(completedMissions)}
                  </HeroMetaValue>
                </HeroMetaItem>
                <HeroMetaItem>
                  <HeroMetaLabel>남은 미션</HeroMetaLabel>
                  <HeroMetaValue>
                    {missionMetricText(remainingMissions)}
                  </HeroMetaValue>
                </HeroMetaItem>
              </HeroMetaRow>

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

              <HeroActions>
                <SecondaryBtn
                  type="button"
                  onClick={handleRefresh}
                  disabled={
                    classInfo.loading || missionsLoading || emergencyLoading
                  }
                >
                  새로고침
                </SecondaryBtn>
              </HeroActions>
            </HeroCard>
          )}
        </Section>

      <Section>
        <Title>긴급 미션</Title>
        {emergencyLoading ? (
          <SectionHelper>긴급 미션을 불러오는 중입니다...</SectionHelper>
        ) : emergencyError ? (
          <SectionHelper>{emergencyError}</SectionHelper>
        ) : emergencyMissions.length > 0 ? (
          <MissionList>
            {emergencyMissions.map((mission) => {
              const deadlineText = formatDeadline(mission.deadline);
              return (
                <MissionRow
                  key={`emergency-${mission.id}`}
                  $completed={mission.completed}
                  $type={mission.missionType}
                >
                  <div>
                    <MissionTitle>{mission.title}</MissionTitle>
                    <MissionMeta>
                      <MissionTypeBadge $variant={mission.missionType}>
                        {missionTypeLabel(mission.missionType)}
                      </MissionTypeBadge>
                      {missionRewardText(mission.missionType) && (
                        <MissionReward>
                          {missionRewardText(mission.missionType)}
                        </MissionReward>
                      )}
                    </MissionMeta>
                    {mission.description && (
                      <MissionDescription>{mission.description}</MissionDescription>
                    )}
                    <MissionFooter>
                      {mission.completed
                        ? "선생님 확인이 완료된 미션입니다."
                        : deadlineText
                        ? `마감: ${deadlineText}`
                        : "반 전체 완료 시 추가 +2 코인 지급"}
                    </MissionFooter>
                  </div>
                  <MissionRight>
                    {mission.completed ? (
                      <DoneBadge>완료됨</DoneBadge>
                    ) : (
                      <PendingBadge>승인 대기</PendingBadge>
                    )}
                  </MissionRight>
                </MissionRow>
              );
            })}
          </MissionList>
        ) : (
          <SectionHelper>등록된 긴급 미션이 없습니다.</SectionHelper>
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
              {missions.map((mission) => {
                const missionType = mission.missionType || "regular";
                return (
                  <MissionRow
                    key={`regular-${mission.id}`}
                    $completed={mission.completed}
                    $type={missionType}
                  >
                    <div>
                      <MissionTitle>{mission.title}</MissionTitle>
                      <MissionMeta>
                        <MissionTypeBadge $variant={missionType}>
                          {missionTypeLabel(missionType)}
                        </MissionTypeBadge>
                        <MissionReward>
                          {missionRewardText(missionType)}
                        </MissionReward>
                      </MissionMeta>
                      {mission.description && (
                        <MissionDescription>
                          {mission.description}
                        </MissionDescription>
                      )}
                      <MissionFooter>
                        {mission.completed
                          ? "선생님 확인이 완료된 미션입니다."
                          : "반 전체 완료 시 추가 +2 코인 지급"}
                      </MissionFooter>
                    </div>
                    <MissionRight>
                      {mission.completed ? (
                        <DoneBadge>완료됨</DoneBadge>
                      ) : (
                        <PendingBadge>승인 대기</PendingBadge>
                      )}
                    </MissionRight>
                  </MissionRow>
                );
              })}
            </MissionList>
          ) : (
            <SectionHelper>오늘 할 미션이 없습니다.</SectionHelper>
          )}
          {missionMessage && <MessageBanner>{missionMessage}</MessageBanner>}
        </Section>

        <div style={{ height: 92 }} />
      </ScrollWrapper>
      <TabNavigation />
    </Container>
  );
};

export default HomePage;
