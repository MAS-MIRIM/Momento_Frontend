import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import TabNavigation from "../components/TabNavigation";
import { useAuth } from "../contexts/AuthContext.jsx";
import ApiService from "../services/api.js";
// speakerImg는 선생님 페이지에서 사용하지 않으므로 제거하거나 그대로 두셔도 무방합니다. 여기서는 유지합니다.
// import speakerImg from "../assets/speaker.png";

/* === 상수 설정 (StudentHomePage와 동일) === */
const LEVEL_THRESHOLDS = [0, 10, 20, 30, 40, 50];
const MAX_LEVEL = 5;
const MAX_LEVEL_PROGRESS = 100;
const CHARACTER_IMAGE_BASE = "http://api.hjun.kr/static/images";

/* === 유틸리티 함수 (StudentHomePage와 동일) === */
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
  // ⭐ 학생 페이지와 동일한 URL 적용
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
  type === "emergency" ? "긴급 미션" : "일반 미션"; // 선생님 등록 시에는 '일반'이 더 명확합니다.

const missionRewardText = (type) =>
  type === "emergency" ? "+3 코인 보상" : "+0.5 코인 · 하루 최대 2회";

/* === 스타일 컴포넌트 (StudentHomePage와 동일한 스타일 사용) === */
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
  box-sizing: border-box;
`;

const Section = styled.section`
  width: 100%;
  max-width: 960px;
  margin-bottom: 24px; /* 섹션 간 간격 추가 */
`;

const Title = styled.h3`
  margin: 18px 0 10px;
  font-size: 18px;
  font-weight: 800;
  color: #111;
`;

// 알 키우기 디자인
const HeroCard = styled.div`
  border: none;
  border-radius: 20px;
  margin-top: 12px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center; /* 가운데 정렬 */
`;

const LevelHeader = styled.div`
  width: 100%;
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
// 미션 리스트 관련 스타일 (학생/선생님 공통 사용)
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

// 미션 등록 폼 스타일
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #eef4f3;
  border-radius: 12px;
  background: #ffffff;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-height: 100px;
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
`;

const Button = styled.button`
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #05baae;
  color: white;
  font-weight: bold;
  cursor: pointer;
  &:disabled {
    background-color: #a0d8d4;
    cursor: not-allowed;
  }
`;

/* === MissionEditor 컴포넌트 (선생님 미션 등록 폼) === */
const MissionEditor = ({ onMissionCreated }) => {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [missionType, setMissionType] = useState("regular");
  const [deadline, setDeadline] = useState("");

  const isEmergency = missionType === "emergency";
  const isFormValid =
    title.trim() !== "" &&
    description.trim() !== "" &&
    (!isEmergency || (isEmergency && deadline.trim() !== ""));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      await ApiService.createMission(token, {
        title,
        description,
        missionType: isEmergency ? "emergency" : "regular",
        deadline: isEmergency ? deadline : null,
      });
      setTitle("");
      setDescription("");
      setMissionType("regular");
      setDeadline("");
      onMissionCreated();
    } catch (error) {
      console.error("Failed to create mission", error);
      alert("미션 생성에 실패했습니다. API 연결 상태를 확인해주세요.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="미션 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="미션 설명"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Select
        value={missionType}
        onChange={(e) => setMissionType(e.target.value)}
      >
        <option value="regular">일반 미션 (+0.5 코인)</option>
        <option value="emergency">긴급 미션 (+3 코인, 마감 시간 설정)</option>
      </Select>
      {isEmergency && (
        <Input
          type="datetime-local"
          placeholder="마감 시간"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      )}
      <Button type="submit" disabled={!isFormValid}>
        미션 등록
      </Button>
    </Form>
  );
};

/* === TeacherHomePage 컴포넌트 === */
const TeacherHomePage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // 반 캐릭터 정보 상태 (StudentHomePage와 동일)
  const [classInfo, setClassInfo] = useState({
    loading: false,
    error: "",
    coin: null,
    image: getCharacterImageUrl(1),
    name: "",
    level: 1,
  });

  const [emergencyMissions, setEmergencyMissions] = useState([]);
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [emergencyError, setEmergencyError] = useState("");

  // 선생님은 홈룸 클래스 정보를 사용
  const educationOfficeCode = user?.educationOfficeCode ?? null;
  const schoolCode = user?.schoolCode ?? null;
  const gradeValue = user?.homeroomGrade ?? null;
  const classValue = user?.homeroomClass ?? null;

  const characterLevel = classInfo.level ?? getCharacterLevel(classInfo.coin);
  const characterImageSrc =
    classInfo.image || getCharacterImageUrl(characterLevel);
  const levelProgress = useMemo(
    () => getLevelProgress(classInfo.coin ?? 0, characterLevel),
    [classInfo.coin, characterLevel]
  );
  const levelProgressLabel = `${levelProgress.current}/${levelProgress.required}`;

  // 반 캐릭터 정보 API 호출 로직 (StudentHomePage와 동일)
  const fetchClassCharacter = useCallback(() => {
    if (!token) return;
    if (!educationOfficeCode || !schoolCode || !gradeValue || !classValue) {
      setClassInfo((prev) => ({
        ...prev,
        error: "반 정보가 없어 캐릭터를 불러올 수 없습니다.",
      }));
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

  // useEffects 추가
  useEffect(() => {
    if (!token || !user) return;
    fetchClassCharacter();
  }, [token, user, fetchClassCharacter]);

  useEffect(() => {
    if (!token) return;
    fetchEmergencyMissions();
  }, [token, fetchEmergencyMissions]);

  return (
    <Container>
      <Header />
      <ScrollWrapper>
        {/* === 1. 반 캐릭터 (알 키우기) 섹션 - 디자인/크기 StudentHomePage와 동일 === */}
        <Section>
          <Title>우리 반 성장 캐릭터</Title>
          {!gradeValue || !classValue ? (
            <SectionHelper>
              담임 학년/반 정보가 없어 반 캐릭터를 표시할 수 없습니다.
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
                // 이미지 경로는 StudentHomePage와 동일하게 하드코딩된 예시를 따라갈 수 있지만, 실제로는 characterImageSrc를 쓰는 것이 맞습니다.
                // 디자인/크기를 위해 StudentHomePage의 이미지 태그를 그대로 가져옴
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

        {/* === 2. 미션 등록 섹션 (기존 요청 사항) === */}
        <Section>
          <Title>새로운 미션 등록하기</Title>
          <SectionHelper>
            긴급 미션은 마감 시간을 설정할 수 있으며 코인 보상이 더 큽니다.
          </SectionHelper>
          <MissionEditor onMissionCreated={fetchEmergencyMissions} />
        </Section>
        <div style={{ height: 92 }} />
      </ScrollWrapper>
      <TabNavigation />
    </Container>
  );
};

export default TeacherHomePage;
