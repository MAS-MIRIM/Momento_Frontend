import styled from "styled-components";
import logo from "../assets/logo.png";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px;
  background-color: #ffffff;
`;

const LogoContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
`;

const Logo = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
`;

const ButtonSection = styled.div`
  width: 100%;
  max-width: 340px;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const PrimaryButton = styled.button`
  width: 100%;
  background-color: #05baae;
  color: #ffffff;
  font-weight: 600;
  font-size: 18px;
  padding: 15px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #049f9a;
  }
`;

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 6px;
  margin-bottom: 44px;
`;

const LoginText = styled.span`
  font-size: 14px;
  color: #666666;
`;

const LoginLink = styled.button`
  background: none;
  border: none;
  color: #05baae;
  font-size: 14px;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
`;

const Welcome = ({ onSignUp = () => {}, onLogin = () => {} }) => {
  return (
    <Container>
      <LogoContainer>
        <Logo src={logo} alt="WEFIT" />
      </LogoContainer>
      <ButtonSection>
        <PrimaryButton type="button" onClick={onSignUp}>
          시작하기
        </PrimaryButton>
        <LoginContainer>
          <LoginText>만약 계정이 있다면?</LoginText>
          <LoginLink type="button" onClick={onLogin}>
            로그인하기
          </LoginLink>
        </LoginContainer>
      </ButtonSection>
    </Container>
  );
};

export default Welcome;
