import React, { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext.jsx";
import profileImg from "../assets/profile.png";
import TabNavigation from "../components/TabNavigation.jsx";
import { Check, X } from "lucide-react"; // 아이콘 라이브러리 사용 가정

// --- 기존 styled-components (생략) ---
// Container, ScrollWrapper, PageWrap, Title, Sub, Grid, Card, Avatar, Name, Meta, Section, CheckTable, Row, Cell, Badge, MissionText, MissionDetail은 기존 코드를 그대로 사용합니다.

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
`;

const PageWrap = styled.div`
  width: 100%;
  max-width: 960px;
  margin-bottom: 120px;
`;

const Title = styled.h2`
  margin: 12px 0 12px;
  font-size: 22px;
  font-weight: 900;
  color: #111;
`;

const Sub = styled.p`
  margin: 0 0 16px;
  color: #7a8a88;
  font-size: 14px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
`;

const Card = styled.button`
  background: #ffffff;
  border: 1px solid #eef4f3;
  border-radius: 14px;
  padding: 16px 14px;
  text-align: left;
  cursor: pointer;
  transition: box-shadow 0.15s ease, transform 0.05s ease;
  &:hover {
    box-shadow: 0 6px 24px rgba(17, 17, 17, 0.06);
  }
  &:active {
    transform: translateY(1px);
  }
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
  margin-bottom: 10px;
`;

const Name = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: #0b3b38;
`;

const Meta = styled.div`
  margin-top: 2px;
  font-size: 13px;
  color: #7a8a88;
`;

const Section = styled.section`
  margin-top: 22px;
`;

const CheckTable = styled.div`
  border: 1px solid #eef4f3;
  border-radius: 12px;
  overflow: hidden;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr; /* 미션 체크 셀 공간 축소 */
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: #fff;
  & + & {
    border-top: 1px solid #eef4f3;
  }
`;

const Cell = styled.div`
  font-size: 14px;
  color: #0b3b38;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Badge = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 9999px;
  color: #008f86;
  background: #daf2f0;
  font-weight: 700;
`;

const MissionText = styled.span`
  font-size: 13px;
  color: #4b5b59;
`;

const MissionDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ToggleButtonWrapper = styled.div`
  display: flex;
  gap: 6px;
  justify-content: flex-end;
  margin-left: auto;
  padding-right: 4px;
`;

const ToggleButton = styled.button`
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #eef4f3;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f7f9f9;
  color: #9aa7a6; /* 기본 아이콘 색상 */

  ${(p) =>
    p.$type === "ok" &&
    p.$selected &&
    css`
      background: #23c098; /* 성공 시 배경색 */
      border-color: #23c098;
      color: #fff; /* 성공 시 아이콘 색상 */
    `}

  ${(p) =>
    p.$type === "fail" &&
    p.$selected &&
    css`
      background: #ff6b6b; /* 실패 시 배경색 */
      border-color: #ff6b6b;
      color: #fff; /* 실패 시 아이콘 색상 */
    `}

  &:hover:not(:disabled) {
    opacity: 0.85;
  }
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

const StatusIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  font-size: 10px;
  font-weight: 700;

  ${(p) =>
    p.$status === "O" &&
    css`
      background: #23c098;
      color: #fff;
    `}
  ${(p) =>
    p.$status === "X" &&
    css`
      background: #ff6b6b;
      color: #fff;
    `}
`;

// --- 데이터 및 컴포넌트 로직 ---

const MISSION_POOL = [
  "친구 한 명에게 칭찬 한마디 전하기",
  "수업 노트 정리해서 선생님께 확인받기",
  "교실 정리정돈 구역 담당하기",
  "급식 후 식판 정리 도와주기",
  "오늘 배운 내용 3줄 요약 작성하기",
  "조별 활동에서 발표 역할 맡기",
  "학습지 제출 여부 다시 확인하기",
];

const StudentsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const classroom = useMemo(() => {
    if (!user) {
      return { grade: null, classNo: null };
    }
    if (user.role === "teacher") {
      return {
        grade: user.homeroomGrade ?? null,
        classNo: user.homeroomClass ?? null,
      };
    }
    return {
      grade: user.grade ?? null,
      classNo: user["class"] ?? null,
    };
  }, [user]);

  const gradeLabel = classroom.grade
    ? `${classroom.grade}학년`
    : "학년 정보 없음";
  const classLabel = classroom.classNo
    ? `${classroom.classNo}반`
    : "반 정보 없음";

  const students = useMemo(() => {
    const base = [
      { id: "S01", name: "정희진", number: 1 },
      { id: "S02", name: "박홍준", number: 2 },
      { id: "S03", name: "윤수아", number: 3 },
      { id: "S04", name: "박지우", number: 4 },
      { id: "S05", name: "김하진", number: 5 },
      { id: "S06", name: "윤건", number: 6 },
    ];
    return base.map((student) => {
      const mission =
        MISSION_POOL[Math.floor(Math.random() * MISSION_POOL.length)];
      return { ...student, mission };
    });
  }, []);

  // 미션 체크 상태: { [studentId]: "O" | "X" | undefined }
  // 기존 코드에서 `setMissionStatus`만 있었기에 `missionStatus` 상태를 추가합니다.
  const [missionStatus, setMissionStatus] = useState({});

  const handleGoDetail = (stu) => {
    navigate(`/student-record`, {
      state: {
        grade: classroom.grade ?? undefined,
        classNo: classroom.classNo ?? undefined,
        name: stu.name,
        number: stu.number,
        id: stu.id,
        mission: stu.mission,
      },
    });
  };

  const checkMission = (id, result) => {
    // 이미 같은 상태라면 미체크 상태로 토글 (해제)
    setMissionStatus((prev) => ({
      ...prev,
      [id]: prev[id] === result ? undefined : result,
    }));
  };

  return (
    <Container>
      <Header />
      <ScrollWrapper>
        <PageWrap>
          <Title>
            {gradeLabel} {classLabel}
          </Title>
          <Sub>학생 카드를 누르면 생기부 작성 페이지로 이동합니다.</Sub>

          <Grid>
            {students.map((s) => (
              <Card key={s.id} onClick={() => handleGoDetail(s)}>
                <Avatar src={profileImg} alt={`${s.name} 프로필`} />
                <Name>{s.name}</Name>
                <Meta>
                  {classroom.grade ? `${classroom.grade}학년 ` : ""}
                  {classroom.classNo ? `${classroom.classNo}반 ` : ""}
                  {s.number}번
                </Meta>
              </Card>
            ))}
          </Grid>

          <Section>
            <Title>미션 체크</Title>
            <CheckTable>
              {students.map((s) => {
                const status = missionStatus[s.id]; // 현재 상태
                return (
                  <Row key={`row-${s.id}`}>
                    <Cell>
                      <MissionDetail>
                        <strong>
                          {status && (
                            <StatusIcon $status={status}>{status}</StatusIcon>
                          )}
                          {s.number}번 {s.name}
                        </strong>
                        <div>
                          <MissionText>{s.mission}</MissionText>
                        </div>
                      </MissionDetail>
                    </Cell>
                    {/* 성공/실패 버튼을 한 셀 안에 배치하고 아이콘으로 대체 */}
                    <Cell style={{ gridColumn: "span 2" }}>
                      <ToggleButtonWrapper>
                        <ToggleButton
                          $type="ok"
                          $selected={status === "O"}
                          onClick={() => checkMission(s.id, "O")}
                          aria-label={`${s.name} 미션 성공`}
                        >
                          <Check size={18} />
                        </ToggleButton>
                        <ToggleButton
                          $type="fail"
                          $selected={status === "X"}
                          onClick={() => checkMission(s.id, "X")}
                          aria-label={`${s.name} 미션 실패`}
                        >
                          <X size={18} />
                        </ToggleButton>
                      </ToggleButtonWrapper>
                    </Cell>
                  </Row>
                );
              })}
            </CheckTable>
          </Section>
        </PageWrap>
      </ScrollWrapper>
      <TabNavigation />
    </Container>
  );
};

export default StudentsPage;
