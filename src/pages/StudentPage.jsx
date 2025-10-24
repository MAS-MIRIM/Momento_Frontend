import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext.jsx";
import profileImg from "../assets/profile.png";

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

const PageWrap = styled.div`
  width: 100%;
  max-width: 960px;
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
  grid-template-columns: 2fr 120px 120px;
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

const ToggleBtn = styled.button`
  border: none;
  border-radius: 10px;
  padding: 8px 0;
  font-weight: 900;
  font-size: 16px;
  cursor: pointer;
  color: #fff;
  background: ${(p) => (p.$type === "ok" ? "#23c098" : "#ff6b6b")};
  &:active {
    transform: translateY(1px);
  }
`;

const MissionChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #f2fbfa;
  color: #0b3b38;
  font-size: 12px;
  font-weight: 600;
  margin-top: 10px;
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
  const [missionStatus, setMissionStatus] = useState({});

  const handleGoDetail = (stu) => {
    navigate(`/students/${stu.id}`, {
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
    setMissionStatus((prev) => ({ ...prev, [id]: result })); // "O" 또는 "X"
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
              {students.map((s) => (
                <Row key={`row-${s.id}`}>
                  <Cell>
                    <MissionDetail>
                      <strong>
                        {s.number}번 {s.name}
                      </strong>
                      <div>
                        <Badge>오늘의 미션</Badge>
                        <MissionText>{s.mission}</MissionText>
                      </div>
                    </MissionDetail>
                  </Cell>
                  <Cell>
                    <ToggleBtn
                      $type="ok"
                      onClick={() => checkMission(s.id, "O")}
                      aria-label="미션 성공"
                    >
                      O
                    </ToggleBtn>
                  </Cell>
                  <Cell>
                    <ToggleBtn
                      $type="x"
                      onClick={() => checkMission(s.id, "X")}
                      aria-label="미션 실패"
                    >
                      X
                    </ToggleBtn>
                  </Cell>
                </Row>
              ))}
            </CheckTable>
            <Sub style={{ marginTop: 8 }}>
              현재 상태:{" "}
              {students.map((s) => (
                <span key={`st-${s.id}`} style={{ marginRight: 8 }}>
                  {s.name}:{missionStatus[s.id] || "-"}
                </span>
              ))}
            </Sub>
          </Section>
        </PageWrap>
      </ScrollWrapper>
    </Container>
  );
};

export default StudentsPage;
