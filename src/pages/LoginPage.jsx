import { useState } from "react";
import styled from "styled-components";
// import ApiService from "../utils/api"; // TODO: 연결되면 API 호출 활성화

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
      <Form onSubmit={handleLogin}>
        <Content>
          <Header>
            POP!CK에서 사용했던
            <br />
            정보를 입력해주세요.
          </Header>

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
        </Content>

        <ButtonGroup>
          <PrimaryButton type="submit" disabled={!isFormValid || isSubmitting}>
            로그인
          </PrimaryButton>
          <PromptRow>
            <PromptText>아직 계정이 없으신가요?</PromptText>
            <TextButton type="button" onClick={onSignUpPress}>
              회원가입
            </TextButton>
          </PromptRow>
        </ButtonGroup>
      </Form>
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

const Form = styled.form`
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
  gap: 20px;
`;

const Header = styled.h1`
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  margin: 0;
  text-align: center;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ hasError }) => (hasError ? "#ff4444" : "#e8e8e8")};
  border-radius: 8px;
  padding: 0 12px;
  background-color: #ffffff;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: #05baae;
  }
`;

const StyledInput = styled.input`
  flex: 1;
  border: none;
  padding: 14px 0;
  font-size: 16px;
  outline: none;
  background: transparent;
  color: #111111;

  ::placeholder {
    color: #a7a7a7;
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

const ErrorText = styled.span`
  color: #ff4444;
  font-size: 14px;
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

const PromptRow = styled.div`
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
