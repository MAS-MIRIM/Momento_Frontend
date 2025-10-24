import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import TabNavigation from "../components/TabNavigation";
import { useAuth } from "../contexts/AuthContext.jsx";
import ApiService from "../services/api.js";
import speakerImg from "../assets/speaker.png";

/* === 상수 설정 === */
const LEVEL_THRESHOLDS = [0, 10, 20, 30, 40, 50];
const MAX_LEVEL = 5;
const MAX_LEVEL_PROGRESS = 100;
// ⭐ 캐릭터 이미지 기본 URL 수정
const CHARACTER_IMAGE_BASE = "http://api.hjun.kr/static/images";

/* === 유틸리티 함수 === */
const getCharacterLevel = (coin) => {
  if (typeof coin !== "number" || coin < 0) return 1;
  if (coin >= 40) return 5;
  if (coin >= 30) return 4;
  if (coin >= 20) return 3;
  if (coin >= 10) return 2;
  return 1;
};

const getCharacterImageUrl = (level) => {
  const safeLevel = Math.min(Math.max(level, 1), 5);
  // ⭐ 여기에 기본 이미지 URL 적용
  return `${CHARACTER_IMAGE_BASE}/${safeLevel}.svg`;
};

const getLevelProgress = (coin, level) => {
  const safeCoin = typeof coin === "number" && coin > 0 ? coin : 0;
  const safeLevel = Math.min(Math.max(level, 1), MAX_LEVEL);
  const start = LEVEL_THRESHOLDS[safeLevel - 1] ?? 0;
  const end = LEVEL_THRESHOLDS[safeLevel] ?? null;

  const target = end !== null ? end - start : MAX_LEVEL_PROGRESS;
  const rawProgress = safeCoin - start;
  const boundedProgress = Math.max(Math.min(rawProgress, target), 0);
  const ratio =
    target > 0 ? Math.min(Math.max(boundedProgress / target, 0), 1) : 0;
  const percent = ratio * 100;
  const normalized = Math.round(ratio * 100);

  return {
    current: normalized,
    required: 100,
    percent,
  };
};

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

/* === 스타일 컴포넌트 === */
const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px; /* 상단 padding만 남기고 좌우 하단 제거 */
  background: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ScrollWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
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
  border: 1px solid #ecebeb;
  border-radius: 200px;
  padding: 8px 18px;
  background: #fafafa;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const NoticeIcon = styled.img`
  width: 22px;
  object-fit: contain;
`;

const NoticeText = styled.p`
  margin: 0;
  color: #0b3b38;
  font-size: 14px;
  font-weight: 600;
  justify-content: center;
  line-height: 1.6;
`;

const HeroCard = styled.div`
  border: none;
  border-radius: 20px;
  margin-top: 12px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  /* ⭐ 캐릭터 가운데 정렬 추가 */
  align-items: center;
`;

const LevelHeader = styled.div`
  width: 100%; /* 너비 100%로 설정 */
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 4px;
`;

const LevelBadge = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 999px;
  color: #008f86;
  font-weight: 900;
  font-size: 16px;
`;

const LevelProgressWrap = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LevelProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: #e7f3f2;
  border-radius: 9999px;
  position: relative;
  overflow: hidden;
`;

const LevelProgressFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, #05baae 0%, #04a099 100%);
  width: ${({ $percent }) => `${$percent}%`};
  transition: width 0.3s ease;
`;

const LevelProgressText = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #0b3b38;
  min-width: 70px;
  text-align: right;
`;

// HeroInfo, HeroMetaRow, HeroMetaItem, HeroMetaLabel, HeroMetaValue, HeroActions 제거

const CharacterImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
`;

const CharEmoji = styled.div`
  font-size: 48px;
  line-height: 1;
  text-align: center;
`;

// CharDesc 제거

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

const StudentHomePage = () => {
  const { user, token } = useAuth();

  const [classInfo, setClassInfo] = useState({
    loading: false,
    error: "",
    coin: null,
    image: getCharacterImageUrl(1),
    name: "",
    level: 1,
  });

  const [missions, setMissions] = useState([]);
  const [missionsLoading, setMissionsLoading] = useState(false);
  const [missionsError, setMissionsError] = useState("");
  const [emergencyMissions, setEmergencyMissions] = useState([]);
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [emergencyError, setEmergencyError] = useState("");

  const primaryNotice = "내일 과학 수행평가 준비물 확인하세요.";
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

  // classLabel, coinLabel, heroTitle, missionMetricText, totalMissions, completedMissions, remainingMissions 제거

  const characterLevel = classInfo.level ?? getCharacterLevel(classInfo.coin);
  const characterImageSrc =
    classInfo.image || getCharacterImageUrl(characterLevel);
  const levelProgress = useMemo(
    () => getLevelProgress(classInfo.coin ?? 0, characterLevel),
    [classInfo.coin, characterLevel]
  );
  const levelProgressLabel = `${levelProgress.current}/${levelProgress.required}`;

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
        const coinValue = typeof data?.coin === "number" ? data.coin : null;
        const levelFromApi =
          typeof data?.level === "number" ? data.level : null;
        const level = levelFromApi ?? getCharacterLevel(coinValue);
        const imageUrl =
          data?.image && String(data.image).trim().length > 0
            ? data.image
            : getCharacterImageUrl(level);

        setClassInfo({
          loading: false,
          error: "",
          coin: coinValue,
          image: imageUrl,
          name: data?.name ?? "",
          level,
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
          image: getCharacterImageUrl(1),
          name: "",
          level: 1,
        });
      });
  }, [token, educationOfficeCode, schoolCode, gradeValue, classValue]);

  const fetchMissions = useCallback(() => {
    if (!token) return;
    setMissionsLoading(true);
    setMissionsError("");

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

  return (
    <Container>
      <Header />
      <ScrollWrapper>
        <Section>
          {primaryNotice ? (
            <NoticeCard>
              <NoticeIcon src={speakerImg} alt="공지" />
              <NoticeText>{primaryNotice}</NoticeText>
            </NoticeCard>
          ) : (
            <SectionHelper>등록된 공지가 없습니다.</SectionHelper>
          )}
        </Section>

        <Section>
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
              <LevelHeader>
                <LevelBadge>{`Lv.${characterLevel}`}</LevelBadge>
                <LevelProgressWrap>
                  <LevelProgressBar>
                    <LevelProgressFill $percent={levelProgress.percent} />
                  </LevelProgressBar>
                  <LevelProgressText>{levelProgressLabel}</LevelProgressText>
                </LevelProgressWrap>
              </LevelHeader>
              {characterImageSrc ? (
                <CharacterImage
                  src="http://api.hjun.kr/static/images/1.svg"
                  alt="반 캐릭터"
                />
              ) : (
                <CharEmoji role="img" aria-label="class character">
                  🏫
                </CharEmoji>
              )}
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
                        <MissionDescription>
                          {mission.description}
                        </MissionDescription>
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
        </Section>
        <div style={{ height: 92 }} />
      </ScrollWrapper>
      <TabNavigation />
    </Container>
  );
};

export default StudentHomePage;
