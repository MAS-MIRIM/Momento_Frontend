import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Container = styled.div`
  width: 100%;
  min-height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
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

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f2fbfa;
  color: #05baae;
  font-weight: 900;
  display: grid;
  place-items: center;
  font-size: 18px;
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
  grid-template-columns: 1fr 120px 120px;
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

const StudentsPage = () => {
  const navigate = useNavigate();

  // 예시 데이터
  const classroom = { grade: 2, classNo: 2 }; // 2학년 2반
  const students = useMemo(
    () => [
      { id: "S01", name: "정희진", number: 1 },
      { id: "S02", name: "김도현", number: 2 },
      { id: "S03", name: "박수연", number: 3 },
      { id: "S04", name: "이서준", number: 4 },
      { id: "S05", name: "최예진", number: 5 },
      { id: "S06", name: "오지후", number: 6 },
    ],
    []
  );

  // 미션 체크 상태: { [studentId]: "O" | "X" | undefined }
  const [missionStatus, setMissionStatus] = useState({});

  const handleGoDetail = (stu) => {
    navigate(`/teacher/students/${stu.id}`, {
      state: {
        grade: classroom.grade,
        classNo: classroom.classNo,
        name: stu.name,
        number: stu.number,
        id: stu.id,
      },
    });
  };

  const checkMission = (id, result) => {
    setMissionStatus((prev) => ({ ...prev, [id]: result })); // "O" 또는 "X"
  };

  return (
    <Container>
      <Header />

      <PageWrap>
        <Title>
          {classroom.grade}학년 {classroom.classNo}반 — 우리 반 학생
        </Title>
        <Sub>학생 카드를 누르면 생기부 작성 페이지로 이동합니다.</Sub>

        <Grid>
          {students.map((s) => (
            <Card key={s.id} onClick={() => handleGoDetail(s)}>
              <Avatar>{s.number}</Avatar>
              <Name>{s.name}</Name>
              <Meta>
                {classroom.grade}학년 {classroom.classNo}반 {s.number}번
              </Meta>
            </Card>
          ))}
        </Grid>

        <Section>
          <Title>미션 체크(O / X)</Title>
          <CheckTable>
            {students.map((s) => (
              <Row key={`row-${s.id}`}>
                <Cell>
                  <strong>
                    {s.number}번 {s.name}
                  </strong>
                  <Badge>오늘의 미션</Badge>
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
    </Container>
  );
};

export default StudentsPage;
