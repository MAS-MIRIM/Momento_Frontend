import { useMemo } from "react";
import styled from "styled-components";
import Header from "../components/Header.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import TabNavigation from "../components/TabNavigation.jsx";
import profile from "../assets/profile.png";

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

const Avatar = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 16px; /* 아바타와 정보 블록 사이의 간격 */
  flex-shrink: 0; /* 크기가 줄어들지 않도록 */
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px; /* 위쪽 간격 */
  width: 100%;
  max-width: 380px;
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
    background: #069c92;
  }
`;

const EmptyState = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 32px;
  text-align: center;
  color: #6b7280;
`;

const ErrorText = styled.p`
  margin: 0;
  margin-top: 24px;
  padding: 12px 16px;
  border-radius: 14px;
  background: #ffecec;
  color: #d93025;
  font-size: 13px;
  line-height: 1.4;
  width: 100%;
  max-width: 380px;
`;

// --- Components for Profile Summary ---
const ProfileSummary = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 380px;
  margin-top: 24px;
  margin-bottom: 24px;
`;

const UserInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const NameDisplay = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: #1f2933;
  margin: 0 0 4px 0;
`;

const DetailDisplay = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

// --- NEW STYLED COMPONENTS FOR SECTIONS ---

const SectionContainer = styled.div`
  width: 100%;
  max-width: 380px;
  margin-top: 24px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 18px; /* H2 정도의 크기 */
  font-weight: 600;
  color: #1f2933;
  margin: 0 0 16px 0;
  padding-left: 8px; /* 리스트와 간격 맞추기 */
`;

const SectionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;

const ListItem = styled.li`
  padding: 14px 8px;
  font-size: 15px;
  color: #3e4c59;
  border-bottom: 1px solid #e5e9ec;
  cursor: pointer; /* 클릭 가능한 느낌 */
  transition: background-color 0.1s ease;

  &:last-child {
    border-bottom: none;
  }
`;

const Spacer = styled.div`
  height: 90px;
  width: 100%;
`;

const ProfilePage = () => {
  const { user, isLoading, error, logout } = useAuth();

  const profileEntries = useMemo(() => {
    if (!user) return [];

    const base = [
      { label: "이름", value: user.name },
      { label: "학교", value: user.school },
    ];
    // ... (rest of the profileEntries logic remains the same)
    if (user.role === "student") {
      base.push(
        { label: "학년", value: user.grade },
        { label: "반", value: user["class"] },
        { label: "번호", value: user.studentNumber }
      );
    }
    // ... (omitted for brevity, as it's unchanged)

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

  // 데이터 추출 및 조합
  const name = profileEntries.find((e) => e.label === "이름")?.value;
  const school = profileEntries.find((e) => e.label === "학교")?.value;
  const grade = profileEntries.find((e) => e.label === "학년")?.value;
  const classValue = profileEntries.find((e) => e.label === "반")?.value;

  const detailInfo = `${school ?? "-"} \t ${grade ? `${grade}학년` : "-"} \t ${
    classValue ? `${classValue}반` : "-"
  }`;

  return (
    <Container>
      <Header />

      {/* 1. 아바타와 정보 블록 */}
      <ProfileSummary>
        <Avatar src={profile} alt="프로필" />
        <UserInfoBlock>
          <NameDisplay>{name ?? "이름 없음"}</NameDisplay>
          <DetailDisplay>{detailInfo}</DetailDisplay>
        </UserInfoBlock>
      </ProfileSummary>

      {error && (
        <ErrorText>
          프로필 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
        </ErrorText>
      )}
      <SectionContainer>
        <SectionTitle>내 설정</SectionTitle>
        <SectionList>
          <ListItem>내 정보</ListItem>
          <ListItem>공지사항</ListItem>
        </SectionList>
      </SectionContainer>

      {/* 5. 문의 섹션 추가 */}
      <SectionContainer>
        <SectionTitle>문의</SectionTitle>
        <SectionList>
          <ListItem>서비스 이용약관</ListItem>
          <ListItem>고객센터 및 1:1 문의</ListItem>
        </SectionList>
      </SectionContainer>
      <Spacer />
      <ActionBar>
        <PrimaryButton onClick={logout}>로그아웃</PrimaryButton>
      </ActionBar>

      <TabNavigation />
    </Container>
  );
};

export default ProfilePage;
