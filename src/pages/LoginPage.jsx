import { useState } from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";
import error from "../assets/error.png";
// import ApiService from "../utils/api"; TODO: 연결되면 API 호출 활성화

const ErrorText = ({ children }) => (
  <StyledErrorText>
    <ErrorIcon src={error} alt="경고" />
    {children}
  </StyledErrorText>
);

const LoginScreen = ({
  onLoginSuccess = () => {},
  onSignUpPress = () => {},
}) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = userId.trim().length > 0 && password.trim().length > 0;

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!userId.trim()) {
      setIdError("아이디를 입력해주세요.");
      return;
    }
    if (!password.trim()) {
      setPasswordError("비밀번호를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      // await ApiService.login(userId, password);
      onLoginSuccess();
    } catch (error) {
      console.error("Login error (placeholder)", error);
      window.alert("로그인 중 문제가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIdChange = (event) => {
    setUserId(event.target.value);
    setIdError("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError("");
  };

  return (
    <Container>
      <Card onSubmit={handleLogin}>
        <Content>
          <StepArea>
            <StepTitle>
              <LogoImg src={logo} alt="로고" />
              에서 사용했던
              <br />
              정보를 입력해주세요.
            </StepTitle>

            <Field>
              <InputWrapper hasError={Boolean(idError)}>
                <StyledInput
                  value={userId}
                  onChange={handleIdChange}
                  placeholder="아이디를 입력해주세요."
                  autoComplete="username"
                />
              </InputWrapper>
              {idError && <ErrorText>{idError}</ErrorText>}
            </Field>

            <Field>
              <InputWrapper hasError={Boolean(passwordError)}>
                <StyledInput
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="비밀번호를 입력해주세요."
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                />
                <ToggleButton
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                >
                  {showPassword ? "숨기기" : "표시"}
                </ToggleButton>
              </InputWrapper>
              {passwordError && <ErrorText>{passwordError}</ErrorText>}
            </Field>
          </StepArea>
        </Content>

        <ButtonGroup>
          <PrimaryButton type="submit" disabled={!isFormValid || isSubmitting}>
            로그인
          </PrimaryButton>
          <LoginPrompt>
            <PromptText>아직 계정이 없으신가요?</PromptText>
            <TextButton type="button" onClick={onSignUpPress}>
              회원가입
            </TextButton>
          </LoginPrompt>
        </ButtonGroup>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 40px 20px;
`;

const Card = styled.form`
  width: 100%;
  max-width: 420px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
`;

const StepArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

const LogoImg = styled.img`
  width: 80px;
  height: auto;
  margin-right: 8px;
  vertical-align: middle;
  margin-bottom: 8px;
`;

const StepTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  line-height: 36px;
  margin: 0;
  text-align: left;
  width: 340px;
  margin-bottom: 8px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  font-family: "Pretendard";
`;

const InputWrapper = styled.div`
  display: flex;
  font-family: "Pretendard";
  align-items: center;
  width: 340px;
  border: 1px solid ${({ hasError }) => (hasError ? "#ff4444" : "#ededed")};
  border-radius: 15px;
  padding: 0 14px;
  background-color: #ffffff;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: #05baae;
  }
`;

const StyledInput = styled.input`
  flex: 1;
  font-family: "Pretendard";
  border: none;
  padding: 14px 0;
  font-size: 16px;
  outline: none;
  background: transparent;
  color: #111111;

  ::placeholder {
    color: #a7a7a7;
    font-family: "Pretendard";
  }
`;

const ToggleButton = styled.button`
  border: none;
  background: none;
  color: #05baae;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 0 4px;
`;

const ErrorIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 4px;
  flex-shrink: 0;
`;

const StyledErrorText = styled.span`
  color: #ff4444;
  font-size: 14px;
  width: 340px;
  text-align: left;
  display: flex;
  align-items: center;
  padding-left: 2px;
  margin-top: 4px;
`;

const ButtonGroup = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 0 auto;
  margin-bottom: 16px;
`;

const PrimaryButton = styled.button`
  width: 100%;
  width: 340px;
  padding: 15px;
  background-color: ${({ disabled }) => (disabled ? "#bde5e1" : "#05baae")};
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 16px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#bde5e1" : "#049f9a")};
  }

  &:active {
    transform: ${({ disabled }) => (disabled ? "none" : "translateY(1px)")};
  }
`;

const LoginPrompt = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
`;

const PromptText = styled.span`
  font-size: 14px;
  color: #666666;
`;

const TextButton = styled.button`
  border: none;
  background: none;
  color: #05baae;
  font-size: 14px;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
`;

export default LoginScreen;
