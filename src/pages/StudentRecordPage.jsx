import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  max-width: 720px;
`;

const Title = styled.h2`
  margin: 12px 0 4px;
  font-size: 22px;
  font-weight: 900;
  color: #111;
`;

const Subtitle = styled.p`
  margin: 0 0 18px;
  color: #6b7684;
  font-size: 14px;
`;

const InfoCard = styled.div`
  border: 1px solid #eef4f3;
  border-radius: 16px;
  background: #f8fffe;
  padding: 16px 18px;
  margin-bottom: 20px;
  color: #0b3b38;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MissionNote = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px dashed #cde7e3;
  font-size: 13px;
  color: #055050;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FieldTitle = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #0b3b38;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 160px;
  border-radius: 14px;
  border: 1px solid #d9efec;
  padding: 14px 16px;
  font-size: 14px;
  line-height: 1.5;
  font-family: inherit;
  resize: vertical;
  &:focus {
    outline: 2px solid rgba(5, 186, 174, 0.2);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const SecondaryButton = styled.button`
  border: 1px solid #cde7e3;
  border-radius: 12px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  background: #ffffff;
  color: #0b3b38;
  cursor: pointer;
  &:hover {
    background: #f4fbfa;
  }
`;

const PrimaryButton = styled.button`
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 700;
  background: #05baae;
  color: #ffffff;
  cursor: pointer;
  &:hover {
    background: #049f96;
  }
`;

const SaveMessage = styled.p`
  margin: 6px 0 0;
  font-size: 13px;
  color: #007f79;
`;

const StudentRecordPage = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const location = useLocation();
  const state = location.state || {};

  const studentName = state.name || "알 수 없는 학생";
  const studentNumber = state.number ? `${state.number}번` : "";
  const classroomLabel =
    state.grade && state.classNo
      ? `${state.grade}학년 ${state.classNo}반`
      : "학급 정보 없음";
  const mission = state.mission || "오늘 미션 정보 없음";

  const defaultRecord = useMemo(() => {
    return [
      `${classroomLabel} ${studentNumber} ${studentName} 학생 생기부 초안`,
      ``,
      `1. 기본 소견`,
      `- 수업 참여도: `,
      `- 생활 태도: `,
      ``,
      `2. 금일 미션 수행`,
      `- 미션 내용: ${mission}`,
      `- 수행 결과 및 피드백: `,
      ``,
      `3. 향후 지도 계획`,
      `- `,
    ].join("\n");
  }, [classroomLabel, mission, studentName, studentNumber]);

  const [record, setRecord] = useState(defaultRecord);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("생기부 저장:", {
      studentId,
      record,
    });
    setSaveMessage("생기부 초안이 임시 저장되었습니다.");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Header />
      <ScrollWrapper>
        <PageWrap>
          <Title>{studentName} 생기부 작성</Title>
          <Subtitle>
            {classroomLabel} {studentNumber} {studentId && `(ID: ${studentId})`}
          </Subtitle>

          <InfoCard>
            <strong>오늘의 미션</strong>
            <MissionNote>{mission}</MissionNote>
          </InfoCard>

          <Form onSubmit={handleSubmit}>
            <Field>
              <FieldTitle>기록 내용</FieldTitle>
              <TextArea
                value={record}
                onChange={(event) => setRecord(event.target.value)}
                placeholder="학생의 수업 태도, 진로 지도, 특별 활동 등을 자유롭게 기록해주세요."
              />
            </Field>

            <ButtonRow>
              <SecondaryButton type="button" onClick={handleBack}>
                목록으로
              </SecondaryButton>
              <PrimaryButton type="submit">생기부 저장</PrimaryButton>
            </ButtonRow>
            {saveMessage && <SaveMessage>{saveMessage}</SaveMessage>}
          </Form>
        </PageWrap>
      </ScrollWrapper>
    </Container>
  );
};

export default StudentRecordPage;
