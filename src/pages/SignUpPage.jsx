import { useMemo, useState } from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";
import error from "../assets/error.png";
import ApiService from "../services/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const ErrorText = ({ children }) => (
  <StyledErrorText>
    <ErrorIcon src={error} alt="경고" />
    {children}
  </StyledErrorText>
);

const EDUCATION_OFFICES = [
  "서울특별시교육청",
  "부산광역시교육청",
  "대구광역시교육청",
  "인천광역시교육청",
  "광주광역시교육청",
  "대전광역시교육청",
  "울산광역시교육청",
  "세종특별자치시교육청",
  "경기도교육청",
  "강원특별자치도교육청",
  "충청북도교육청",
  "충청남도교육청",
  "전북특별자치도교육청",
  "전라남도교육청",
  "경상북도교육청",
  "경상남도교육청",
  "제주특별자치도교육청",
];

const SignUpScreen = ({
  onSignUpSuccess = () => {},
  onLoginPress = () => {},
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [role, setRole] = useState("");

  const [name, setName] = useState("");
  const [educationOffice, setEducationOffice] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [grade, setGrade] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [homeroomGrade, setHomeroomGrade] = useState("");
  const [homeroomClass, setHomeroomClass] = useState("");

  const [userId, setUserId] = useState("");
  const [isIdValid, setIsIdValid] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isCheckingId, setIsCheckingId] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // errors & submitting
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [idError, setIdError] = useState("");
  const [educationOfficeError, setEducationOfficeError] = useState("");
  const [schoolNameError, setSchoolNameError] = useState("");
  const [schoolDetailError, setSchoolDetailError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [homeroomError, setHomeroomError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();

  const validatePassword = (pass) => {
    const hasMinLength = pass.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (!hasMinLength) return "비밀번호는 8자리 이상이어야 합니다.";
    if (!hasSpecialChar) return "특수문자를 포함해야 합니다.";
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

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setFormError("");

    if (selectedRole === "student") {
      setSubject("");
      setHomeroomGrade("");
      setHomeroomClass("");
      setSubjectError("");
      setHomeroomError("");
    }

    if (selectedRole === "teacher") {
      setGrade("");
      setClassNumber("");
      setStudentNumber("");
      setSchoolDetailError("");
    }
  };

  const canSubmit = useMemo(() => {
    if (currentStep === 0) {
      return !!role;
    }
    if (currentStep === 1) {
      if (!name.trim() || !educationOffice.trim() || !schoolName.trim()) {
        return false;
      }

      if (role === "student") {
        return (
          grade.trim().length > 0 &&
          classNumber.trim().length > 0 &&
          studentNumber.trim().length > 0
        );
      }

      if (role === "teacher") {
        if (!subject.trim()) {
          return false;
        }

        const hasHomeroomData =
          homeroomGrade.trim().length > 0 || homeroomClass.trim().length > 0;
        if (hasHomeroomData) {
          return (
            homeroomGrade.trim().length > 0 &&
            homeroomClass.trim().length > 0
          );
        }

        return true;
      }
      return false;
    }
    if (currentStep === 2) {
      return isIdValid && !isCheckingId;
    }
    if (currentStep === 3) {
      return isPasswordValid;
    }
    return false;
  }, [
    currentStep,
    role,
    name,
    educationOffice,
    schoolName,
    grade,
    classNumber,
    studentNumber,
    subject,
    homeroomGrade,
    homeroomClass,
    isIdValid,
    isCheckingId,
    isPasswordValid,
  ]);

  const checkIdDuplicate = async () => {
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
    setIsCheckingId(true);
    try {
      const { haveId } = await ApiService.checkUserId(userId.trim());
      if (haveId) {
        setIdError("이미 사용 중인 아이디입니다.");
        setIsIdValid(false);
      } else {
        setIsIdValid(true);
      }
      setIsIdChecked(true);
    } catch (error) {
      console.error("ID duplicate check failed", error);
      const message =
        error?.data?.message ||
        error?.message ||
        "아이디 확인 중 오류가 발생했습니다.";
      setIdError(message);
      setIsIdChecked(false);
      setIsIdValid(false);
    } finally {
      setIsCheckingId(false);
    }
  };

  const handleIdChange = (e) => {
    setUserId(e.target.value);
    setIsIdChecked(false);
    setIsIdValid(false);
    setIdError("");
    if (formError) setFormError("");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    const error = validatePassword(value);
    setPasswordError(error);
    if (formError) setFormError("");

    if (passwordConfirm && value !== passwordConfirm) {
      setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordConfirmError("");
    }
  };

  const handlePasswordConfirmChange = (e) => {
    const value = e.target.value;
    setPasswordConfirm(value);
    if (formError) setFormError("");
    if (value && value !== password) {
      setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordConfirmError("");
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (isSubmitting || !canSubmit) return;
    setFormError("");

    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    if (currentStep === 1) {
      let hasError = false;

      if (!name.trim()) {
        setNameError("이름을 입력해주세요.");
        hasError = true;
      } else {
        setNameError("");
      }

      if (!educationOffice.trim()) {
        setEducationOfficeError("교육청을 선택해주세요.");
        hasError = true;
      } else {
        setEducationOfficeError("");
      }

      if (!schoolName.trim()) {
        setSchoolNameError("학교명을 입력해주세요.");
        hasError = true;
      } else {
        setSchoolNameError("");
      }

      if (role === "student") {
        if (!grade.trim() || !classNumber.trim() || !studentNumber.trim()) {
          setSchoolDetailError("학년, 반, 번호를 모두 입력해주세요.");
          hasError = true;
        } else {
          setSchoolDetailError("");
        }
        setSubjectError("");
        setHomeroomError("");
      }

      if (role === "teacher") {
        if (!subject.trim()) {
          setSubjectError("담당 과목을 입력해주세요.");
          hasError = true;
        } else {
          setSubjectError("");
        }

        const hasHomeroomGrade = homeroomGrade.trim().length > 0;
        const hasHomeroomClass = homeroomClass.trim().length > 0;
        if (hasHomeroomGrade !== hasHomeroomClass) {
          setHomeroomError("담임 학년과 담임 반을 모두 입력해주세요.");
          hasError = true;
        } else {
          setHomeroomError("");
        }

        setSchoolDetailError("");
      }

      if (hasError) return;

      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!userId.trim()) {
        setIdError("아이디를 입력해주세요.");
        return;
      }
      if (!isIdChecked || !isIdValid) {
        setIdError("아이디 중복 확인을 해주세요.");
        return;
      }
      setIdError("");
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!isPasswordValid) return;
      setIsSubmitting(true);
      try {
        const basePayload = {
          role,
          name: name.trim(),
          userId: userId.trim(),
          school: schoolName.trim(),
          password,
        };

        let payload = basePayload;
        if (role === "student") {
          payload = {
            ...basePayload,
            grade: Number(grade),
            class: Number(classNumber),
            studentNumber: Number(studentNumber),
          };
        } else if (role === "teacher") {
          payload = {
            ...basePayload,
            subject: subject.trim(),
          };
          if (homeroomGrade.trim()) {
            payload.homeroomGrade = Number(homeroomGrade);
          }
          if (homeroomClass.trim()) {
            payload.homeroomClass = Number(homeroomClass);
          }
        }

        await ApiService.register(payload);
        await login(userId.trim(), password);

        try {
          localStorage.setItem("isFirstSignUp", "true");
        } catch (storageError) {
          console.warn("Unable to access localStorage", storageError);
        }

        onSignUpSuccess();
      } catch (err) {
        console.error("Signup error", err);
        const message =
          err?.data?.message ||
          err?.message ||
          "회원가입 중 문제가 발생했습니다.";
        setFormError(message);
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
              onClick={() => handleRoleSelect("student")}
            >
              <RoleIcon aria-hidden>🎒</RoleIcon>
              <RoleDesc>수업 참여, 과제 제출</RoleDesc>
              <RoleDivider />
              <RoleTitle>학생</RoleTitle>
            </RoleCard>

            <RoleCard
              type="button"
              selected={role === "teacher"}
              onClick={() => handleRoleSelect("teacher")}
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
            기본 정보를 입력해주세요.
          </StepTitle>

          <Field>
            <InputWrapper hasError={Boolean(nameError)}>
              <StyledInput
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError("");
                }}
                placeholder="이름을 입력해주세요."
                autoComplete="name"
              />
            </InputWrapper>
            {nameError && <ErrorText>{nameError}</ErrorText>}
          </Field>

          <Field>
            <InputWrapper hasError={Boolean(educationOfficeError)}>
              <StyledSelect
                value={educationOffice}
                onChange={(e) => {
                  setEducationOffice(e.target.value);
                  if (educationOfficeError) setEducationOfficeError("");
                }}
              >
                <option value="">교육청을 선택하세요</option>
                {EDUCATION_OFFICES.map((ofc) => (
                  <option key={ofc} value={ofc}>
                    {ofc}
                  </option>
                ))}
              </StyledSelect>
            </InputWrapper>
            {educationOfficeError && (
              <ErrorText>{educationOfficeError}</ErrorText>
            )}
          </Field>

          <Field>
            <InputWrapper hasError={Boolean(schoolNameError)}>
              <StyledInput
                value={schoolName}
                onChange={(e) => {
                  setSchoolName(e.target.value);
                  if (schoolNameError) setSchoolNameError("");
                }}
                placeholder="학교명을 입력해주세요."
              />
            </InputWrapper>
            {schoolNameError && <ErrorText>{schoolNameError}</ErrorText>}
          </Field>

          {role === "student" && (
            <Field>
              <InlineFieldGroup>
                <InlineInputWrapper hasError={Boolean(schoolDetailError)}>
                  <StyledInputSmall
                    value={grade}
                    onChange={(e) => {
                      setGrade(e.target.value);
                      if (schoolDetailError) setSchoolDetailError("");
                    }}
                    placeholder="학년"
                    inputMode="numeric"
                  />
                  <InlineSuffix>학년</InlineSuffix>
                </InlineInputWrapper>

                <InlineInputWrapper hasError={Boolean(schoolDetailError)}>
                  <StyledInputSmall
                    value={classNumber}
                    onChange={(e) => {
                      setClassNumber(e.target.value);
                      if (schoolDetailError) setSchoolDetailError("");
                    }}
                    placeholder="반"
                    inputMode="numeric"
                  />
                  <InlineSuffix>반</InlineSuffix>
                </InlineInputWrapper>

                <InlineInputWrapper hasError={Boolean(schoolDetailError)}>
                  <StyledInputSmall
                    value={studentNumber}
                    onChange={(e) => {
                      setStudentNumber(e.target.value);
                      if (schoolDetailError) setSchoolDetailError("");
                    }}
                    placeholder="번호"
                    inputMode="numeric"
                  />
                  <InlineSuffix>번</InlineSuffix>
                </InlineInputWrapper>
              </InlineFieldGroup>
              {schoolDetailError && <ErrorText>{schoolDetailError}</ErrorText>}
            </Field>
          )}

          {role === "teacher" && (
            <>
              <Field>
                <InputWrapper hasError={Boolean(subjectError)}>
                  <StyledInput
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      if (subjectError) setSubjectError("");
                    }}
                    placeholder="담당 과목을 입력해주세요."
                    autoComplete="organization-title"
                  />
                </InputWrapper>
                {subjectError && <ErrorText>{subjectError}</ErrorText>}
              </Field>

              <Field>
                <InlineFieldGroup>
                  <InlineInputWrapper hasError={Boolean(homeroomError)}>
                    <StyledInputSmall
                      value={homeroomGrade}
                      onChange={(e) => {
                        setHomeroomGrade(e.target.value);
                        if (homeroomError) setHomeroomError("");
                      }}
                      placeholder="담임 학년 (선택)"
                      inputMode="numeric"
                    />
                    <InlineSuffix>학년</InlineSuffix>
                  </InlineInputWrapper>

                  <InlineInputWrapper hasError={Boolean(homeroomError)}>
                    <StyledInputSmall
                      value={homeroomClass}
                      onChange={(e) => {
                        setHomeroomClass(e.target.value);
                        if (homeroomError) setHomeroomError("");
                      }}
                      placeholder="담임 반 (선택)"
                      inputMode="numeric"
                    />
                    <InlineSuffix>반</InlineSuffix>
                  </InlineInputWrapper>
                </InlineFieldGroup>
                {homeroomError && <ErrorText>{homeroomError}</ErrorText>}
              </Field>
            </>
          )}
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
              <OutlineButton
                type="button"
                onClick={checkIdDuplicate}
                disabled={isCheckingId}
              >
                {isCheckingId ? "확인 중..." : "중복 확인"}
              </OutlineButton>
            </InputWrapper>
            {idError && <ErrorText>{idError}</ErrorText>}
          </Field>
        </>
      );
    }

    // step 3
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
              onClick={() => setShowPassword((p) => !p)}
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

  const primaryLabel = isSubmitting
    ? "처리 중..."
    : currentStep === 3
    ? "완료"
    : "다음으로";

  return (
    <Container>
      <Card onSubmit={handleNext}>
        <Content>
          <StepArea>{renderStepContent()}</StepArea>
          {formError && <FormError>{formError}</FormError>}
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

/* ===== styled ===== */

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
  margin-top: 50%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  gap: 24px;
  padding-top: 24px;
`;

const StepArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  width: 100%;
  max-width: 340px;
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
  width: 100%;
  margin-bottom: 12px;
  min-height: 72px;
  position: static;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  font-family: "Pretendard";
  width: 100%;
`;

const InlineFieldGroup = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 340px;
`;

const InputWrapper = styled.div`
  display: flex;
  font-family: "Pretendard";
  align-items: center;
  width: 100%;
  max-width: 340px;
  border: 1px solid ${({ hasError }) => (hasError ? "#ff4444" : "#ededed")};
  border-radius: 15px;
  padding: 0 12px;
  background-color: #ffffff;
  transition: border-color 0.2s ease;
  &:focus-within {
    border-color: #05baae;
  }
`;

const InlineInputWrapper = styled(InputWrapper)`
  flex: 1;
  max-width: none;
  padding-right: 8px;
`;

const StyledInput = styled.input`
  flex: 1;
  font-family: "Pretendard";
  border: none;
  padding: 12px 0;
  font-size: 16px;
  outline: none;
  background: transparent;
  color: #111111;
  ::placeholder {
    color: #a7a7a7;
    font-family: "Pretendard";
  }
`;

const StyledInputSmall = styled.input`
  flex: 1;
  font-family: "Pretendard";
  border: none;
  width: 30px;
  padding: 12px 0;
  font-size: 14px;
  outline: none;
  background: transparent;
  color: #111111;
  ::placeholder {
    color: #a7a7a7;
    font-family: "Pretendard";
  }
`;

const StyledSelect = styled.select`
  flex: 1;
  font-family: "Pretendard";
  border: none;
  padding: 12px 0;
  font-size: 16px;
  outline: none;
  background: transparent;
  color: #111111;
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
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: transparent;
  }
`;

const ErrorIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 4px;
  flex-shrink: 0;
`;

const FormError = styled.div`
  width: 100%;
  max-width: 340px;
  padding: 12px 14px;
  border-radius: 14px;
  background: #ffecec;
  color: #d93025;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  box-shadow: inset 0 0 0 1px rgba(217, 48, 37, 0.08);
`;

const StyledErrorText = styled.span`
  color: #ff4444;
  font-size: 14px;
  width: 100%;
  max-width: 340px;
  text-align: left;
  display: flex;
  align-items: center;
  padding-left: 2px;
  margin-top: 4px;
`;

const InlineSuffix = styled.span`
  font-size: 14px;
  color: #666666;
  margin-left: 6px;
  flex-shrink: 0;
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
  max-width: 340px;
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
  width: 100%;
  max-width: 340px;
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
