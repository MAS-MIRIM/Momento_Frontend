import { useMemo } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext.jsx";
import TabNavigation from "../components/TabNavigation.jsx";

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 20px 120px;
  background-color: #f7f9fa;
  min-height: 100%;
  position: relative;
`;

const Card = styled.section`
  width: 100%;
  max-width: 420px;
  background-color: #ffffff;
  border-radius: 24px;
  padding: 28px 24px;
  box-shadow: 0 12px 32px rgba(17, 17, 17, 0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #57606a;
  font-size: 14px;
`;

const InfoList = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 16px;
  margin: 0;
`;

const Term = styled.dt`
  font-size: 13px;
  color: #a0a7b0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Detail = styled.dd`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2933;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const PrimaryButton = styled.button`
  flex: 1;
  border: none;
  border-radius: 16px;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  background: #05baae;
  color: #ffffff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 16px rgba(5, 186, 174, 0.25);
  }
`;

const OutlineButton = styled.button`
  flex: 1;
  border: 1px solid #dae1e7;
  border-radius: 16px;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  color: #1f2933;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e0;
  }
`;

const EmptyState = styled.div`
  width: 100%;
  max-width: 420px;
  background-color: #ffffff;
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  color: #6b7280;
`;

const ErrorText = styled.p`
  margin: 0;
  margin-top: -8px;
  padding: 12px 16px;
  border-radius: 14px;
  background: #ffecec;
  color: #d93025;
  font-size: 13px;
  line-height: 1.4;
`;

const ProfilePage = () => {
  const { user, isLoading, error, refreshProfile, logout } = useAuth();

  const profileEntries = useMemo(() => {
    if (!user) return [];

    const base = [
      { label: "이름", value: user.name },
      { label: "역할", value: user.role === "teacher" ? "선생님" : "학생" },
      { label: "아이디", value: user.userId },
      { label: "학교", value: user.school },
      {
        label: "가입일",
        value: new Date(user.createdAt).toLocaleString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      },
    ];

    if (user.role === "student") {
      base.push(
        { label: "학년", value: user.grade },
        { label: "반", value: user["class"] },
        { label: "번호", value: user.studentNumber }
      );
    }

    if (user.role === "teacher") {
      if (user.subject) {
        base.push({ label: "담당 과목", value: user.subject });
      }
      if (user.homeroomGrade) {
        base.push({ label: "담임 학년", value: user.homeroomGrade });
      }
      if (user.homeroomClass) {
        base.push({ label: "담임 반", value: user.homeroomClass });
      }
    }

    return base;
  }, [user]);

  if (isLoading && !user) {
    return (
      <Container>
        <EmptyState>프로필 정보를 불러오는 중입니다...</EmptyState>
        <TabNavigation />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <EmptyState>로그인 후 프로필 정보를 확인할 수 있습니다.</EmptyState>
        <TabNavigation />
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Header>
          <Title>{user.name}님</Title>
          <Subtitle>가입하신 정보를 확인하고 관리할 수 있어요.</Subtitle>
        </Header>

        <InfoList>
          {profileEntries.map((entry) => (
            <div key={`${entry.label}-${entry.value}`}>
              <Term>{entry.label}</Term>
              <Detail>{entry.value ?? "-"}</Detail>
            </div>
          ))}
        </InfoList>

        {error && (
          <ErrorText>
            프로필 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
          </ErrorText>
        )}

        <ActionBar>
          <OutlineButton
            type="button"
            onClick={() => refreshProfile().catch(() => {})}
          >
            새로고침
          </OutlineButton>
          <PrimaryButton type="button" onClick={logout}>
            로그아웃
          </PrimaryButton>
        </ActionBar>
      </Card>
      <TabNavigation />
    </Container>
  );
};

export default ProfilePage;
