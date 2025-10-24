import { useMemo, useState } from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";
import error from "../assets/error.png";
// import ApiService from "../utils/api"; // TODO: 연결되면 API 호출 활성화

const ErrorText = ({ children }) => (
  <StyledErrorText>
    <ErrorIcon src={error} alt="경고" />
    {children}
  </StyledErrorText>
);

const SignUpScreen = ({
  onSignUpSuccess = () => {},
  onLoginPress = () => {},
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [role, setRole] = useState("");

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [idError, setIdError] = useState("");
  const [isIdValid, setIsIdValid] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = (pass) => {
    const hasMinLength = pass.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (!hasMinLength) {
      return "비밀번호는 8자리 이상이어야 합니다.";
    }
    if (!hasSpecialChar) {
      return "특수문자를 포함해야 합니다.";
    }
    return "";
  };

  const isPasswordValid = useMemo(
    () =>
      password.length >= 8 &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password) &&
      password === passwordConfirm &&
      passwordConfirm.length > 0 &&
      !passwordError &&
      !passwordConfirmError,
    [password, passwordConfirm, passwordError, passwordConfirmError]
  );

  const canSubmit = useMemo(() => {
    if (currentStep === 0) {
      return !!role;
    }
    if (currentStep === 1) {
      return isIdValid;
    }
    if (currentStep === 2) {
      return isPasswordValid;
    }
    if (currentStep === 3) {
      return nickname.trim().length > 0;
    }
    return false;
  }, [currentStep, role, isIdValid, isPasswordValid, nickname]);

  const checkIdDuplicate = () => {
    if (!userId.trim()) {
      setIdError("아이디를 입력해주세요.");
      return;
    }

    if (userId.length < 2) {
      setIdError("아이디는 2자 이상이어야 합니다.");
      setIsIdValid(false);
      return;
    }

    setIdError("");
    setIsIdValid(true);
    setIsIdChecked(true);
    console.log("사용 가능한 아이디 형식입니다.");
  };

  const handleIdChange = (event) => {
    const { value } = event.target;
    setUserId(value);
    setIsIdChecked(false);
    setIsIdValid(false);
    setIdError("");
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;
    setPassword(value);
    const error = validatePassword(value);
    setPasswordError(error);

    if (passwordConfirm && value !== passwordConfirm) {
      setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordConfirmError("");
    }
  };

  const handlePasswordConfirmChange = (event) => {
    const { value } = event.target;
    setPasswordConfirm(value);
    if (value && value !== password) {
      setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordConfirmError("");
    }
  };

  const handleNext = async (event) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    if (currentStep === 1) {
      if (!userId.trim()) {
        setIdError("아이디를 입력해주세요.");
        return;
      }
      if (!isIdChecked) {
        setIdError("아이디 중복 확인을 해주세요.");
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (isPasswordValid) {
        setCurrentStep(3);
      }
      return;
    }

    if (currentStep === 3) {
      if (!nickname.trim()) return;

      setIsSubmitting(true);
      try {
        // await ApiService.register({ userId, password, nickname, role });
        // await ApiService.login({ userId, password });

        try {
          console.log("Setting isFirstSignUp to true");
          // localStorage.setItem("isFirstSignUp", "true");
        } catch (storageError) {
          console.warn("Unable to access localStorage", storageError);
        }
        onSignUpSuccess();
      } catch (error) {
        console.error("Signup error (placeholder)", error);
        console.error("회원가입 중 문제가 발생했습니다.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderStepContent = () => {
    if (currentStep === 0) {
      return (
        <>
          <StepTitle>
            <LogoImg src={logo} alt="로고" />
            에서 사용하실
            <br />
            역할을 선택해주세요.
          </StepTitle>

          <RoleGrid>
            <RoleCard
              type="button"
              selected={role === "student"}
              onClick={() => setRole("student")}
            >
              <RoleIcon aria-hidden>🎒</RoleIcon>
              <RoleDesc>수업 참여, 과제 제출</RoleDesc>
              <RoleDivider />
              <RoleTitle>학생</RoleTitle>
            </RoleCard>

            <RoleCard
              type="button"
              selected={role === "teacher"}
              onClick={() => setRole("teacher")}
            >
              <RoleIcon aria-hidden>👩‍🏫</RoleIcon>
              <RoleDesc>수업 관리, 과제 배포</RoleDesc>
              <RoleDivider />
              <RoleTitle>선생님</RoleTitle>
            </RoleCard>
          </RoleGrid>
        </>
      );
    }

    if (currentStep === 1) {
      return (
        <>
          <StepTitle>
            <LogoImg src={logo} alt="로고" />
            에서 사용하실
            <br />
            학교를 입력해주세요.
          </StepTitle>
          <Field>
            <InputWrapper>
              <StyledInput
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="학교명을 입력해주세요."
              />
            </InputWrapper>
          </Field>
        </>
      );
    }

    if (currentStep === 2) {
      return (
        <>
          <StepTitle>
            <LogoImg src={logo} alt="로고" />
            에서 사용하실
            <br />
            아이디를 입력해주세요.
          </StepTitle>
          <Field>
            <InputWrapper hasError={Boolean(idError)}>
              <StyledInput
                value={userId}
                onChange={handleIdChange}
                placeholder="아이디를 입력해주세요."
                autoComplete="username"
              />
              <OutlineButton type="button" onClick={checkIdDuplicate}>
                중복 확인
              </OutlineButton>
            </InputWrapper>
            {idError && <ErrorText>{idError}</ErrorText>}
          </Field>
        </>
      );
    }

    return (
      <>
        <StepTitle>
          <LogoImg src={logo} alt="로고" />
          에서 사용하실
          <br />
          비밀번호를 입력해주세요.
        </StepTitle>
        <Field>
          <InputWrapper hasError={Boolean(passwordError)}>
            <StyledInput
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력해주세요."
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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

        <Field>
          <InputWrapper hasError={Boolean(passwordConfirmError)}>
            <StyledInput
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              placeholder="비밀번호를 다시 한 번 입력해주세요."
              type="password"
              autoComplete="new-password"
            />
          </InputWrapper>
          {passwordConfirmError && (
            <ErrorText>{passwordConfirmError}</ErrorText>
          )}
        </Field>
      </>
    );
  };

  const primaryLabel =
    currentStep === 3 ? "완료" : currentStep === 0 ? "다음으로" : "다음으로";

  return (
    <Container>
      <Card onSubmit={handleNext}>
        <Content>
          <StepArea>{renderStepContent()}</StepArea>
        </Content>

        <ButtonGroup>
          <PrimaryButton type="submit" disabled={!canSubmit || isSubmitting}>
            {primaryLabel}
          </PrimaryButton>
          <LoginPrompt>
            <PromptText>이미 계정이 있으신가요?</PromptText>
            <TextButton type="button" onClick={onLoginPress}>
              로그인
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
  position: relative;
  gap: 24px;
`;

const StepArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

const LogoImg = styled.img`
  width: 120px;
  height: auto;
  margin-right: 4px;
  vertical-align: middle;
  margin-bottom: 4px;
`;

const StepTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  line-height: 36px;
  margin: 0;
  text-align: left;
  width: 340px;
  margin-bottom: 12px;
  min-height: 72px;
  position: static;
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

const OutlineButton = styled.button`
  border: 1px solid #05baae;
  background-color: transparent;
  font-family: "Pretendard";
  color: #05baae;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 20px;
  cursor: pointer;
  margin-left: 8px;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: rgba(5, 186, 174, 0.1);
  }
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

const RoleGrid = styled.div`
  width: 340px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 8px;
`;

const RoleCard = styled.button`
  border: 2px solid ${({ selected }) => (selected ? "#05baae" : "#ededed")};
  background: ${({ selected }) => (selected ? "rgba(5,186,174,0.08)" : "#fff")};
  border-radius: 16px;
  padding: 16px 12px;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  &:hover {
    border-color: #05baae;
    background: rgba(5, 186, 174, 0.06);
  }
`;

const RoleIcon = styled.div`
  font-size: 52px;
  line-height: 1;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const RoleTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-top: 16px;
  color: #111111;
`;

const RoleDesc = styled.div`
  font-size: 12px;
  margin-top: 18px;
  margin-bottom: 16px;
  color: #666666;
`;

const RoleDivider = styled.hr`
  width: 100%;
  height: 1.2px;
  border: none;
  background-color: #ededed;
`;

export default SignUpScreen;
