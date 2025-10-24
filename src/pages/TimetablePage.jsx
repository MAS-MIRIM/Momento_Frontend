import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import TabNavigation from "../components/TabNavigation";
import ApiService from "../services/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

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

const ClassLine = styled.div`
  margin-top: 18px;
  font-size: 20px;
  font-weight: 700;
  color: #111;
`;

const SubLine = styled.p`
  margin: 6px 0 0;
  font-size: 14px;
  color: #6b7684;
`;

const DateBar = styled.div`
  width: 100%;
  max-width: 960px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
`;

const DateBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: #ffffff;
  color: #05baae;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.05s ease;
  &:hover {
    background: #f6fbfa;
  }
  &:active {
    transform: translateY(1px);
  }
`;

const DateText = styled.div`
  font-size: 16px;
  color: #333;
  min-width: 220px;
  text-align: center;
`;

const TimetableWrap = styled.div`
  width: 100%;
  max-width: 960px;
  margin-top: 14px;
  padding: 0 8px;
`;

const PeriodRow = styled.div`
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #eef4f3;
  & + & {
    margin-top: 8px;
  }
`;

const PeriodBadge = styled.div`
  height: 32px;
  border-radius: 9999px;
  background: #daf2f0;
  color: #008f86;
  font-size: 14px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Subject = styled.div`
  font-size: 15px;
  color: #0b3b38;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Teacher = styled.span`
  font-size: 13px;
  color: #7a8a88;
  font-weight: 500;
`;

const MealSection = styled.section`
  width: 100%;
  max-width: 960px;
  margin-top: 16px;
  padding: 0 8px 90px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 800;
  color: #111;
`;

const MealCards = styled.div`
  display: grid;
  gap: 12px;
`;

const MealCard = styled.div`
  border: 1px solid #eef4f3;
  border-radius: 16px;
  background: #ffffff;
  padding: 14px 16px;
`;

const MealHeading = styled.h4`
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 800;
  color: #0b3b38;
`;

const MealList = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: #334155;
  font-size: 14px;
  line-height: 1.6;
`;

const MealItem = styled.li`
  margin: 0;
`;

const HelperBox = styled.div`
  width: 100%;
  max-width: 960px;
  padding: 16px;
  border-radius: 16px;
  background: #f4fffe;
  color: #004f49;
  border: 1px solid #d4f4ef;
  text-align: center;
  margin-top: 24px;
`;

const ErrorBox = styled(HelperBox)`
  background: #fff5f5;
  color: #d93025;
  border-color: #ffd5d0;
`;

const LoadingBox = styled(HelperBox)`
  background: #ffffff;
  color: #0b3b38;
  border-color: #eaf6f4;
`;

const BottomPad = styled.div`
  height: 92px;
`;

function fmtKoreanDate(d) {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const w = weekdays[d.getDay()];
  return `${y}년 ${m}월 ${day}일 (${w})`;
}

const TimetablePage = () => {
  const { user, token } = useAuth();
  const [date, setDate] = useState(() => new Date());
  const [timetableDays, setTimetableDays] = useState([]);
  const [timetableError, setTimetableError] = useState("");
  const [isTimetableLoading, setIsTimetableLoading] = useState(false);

  const [mealData, setMealData] = useState(null);
  const [mealError, setMealError] = useState("");
  const [isMealLoading, setIsMealLoading] = useState(false);

  const grade = useMemo(() => {
    if (!user) return null;
    if (user.role === "student") return user.grade ?? null;
    return user.homeroomGrade ?? null;
  }, [user]);

  const klass = useMemo(() => {
    if (!user) return null;
    if (user.role === "student") return user["class"] ?? null;
    return user.homeroomClass ?? null;
  }, [user]);

  const schoolCode = user?.schoolCode;
  const educationOfficeCode = user?.educationOfficeCode;

  const yyyymmdd = useMemo(() => {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, "0");
    const d = `${date.getDate()}`.padStart(2, "0");
    return `${y}${m}${d}`;
  }, [date]);

  useEffect(() => {
    if (!educationOfficeCode || !schoolCode || !grade || !klass) {
      return;
    }

    let ignore = false;
    setIsTimetableLoading(true);
    setTimetableError("");

    ApiService.getTimetable(
      {
        educationOfficeCode,
        schoolCode,
        grade,
        classNumber: klass,
        date: yyyymmdd,
      },
      token
    )
      .then((data) => {
        if (ignore) return;
        setTimetableDays(Array.isArray(data?.days) ? data.days : []);
      })
      .catch((error) => {
        if (ignore) return;
        console.error("Failed to fetch timetable", error);
        setTimetableError(
          error?.data?.message ||
            error?.message ||
            "시간표 정보를 불러오지 못했습니다."
        );
        setTimetableDays([]);
      })
      .finally(() => {
        if (!ignore) setIsTimetableLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [educationOfficeCode, schoolCode, grade, klass, yyyymmdd, token]);

  useEffect(() => {
    if (!educationOfficeCode || !schoolCode) {
      return;
    }

    let ignore = false;
    setIsMealLoading(true);
    setMealError("");

    ApiService.getMeal(
      {
        educationOfficeCode,
        schoolCode,
        date: yyyymmdd,
      },
      token
    )
      .then((data) => {
        if (ignore) return;
        setMealData(data || null);
      })
      .catch((error) => {
        if (ignore) return;
        console.error("Failed to fetch meal", error);
        setMealError(
          error?.data?.message ||
            error?.message ||
            "급식 정보를 불러오지 못했습니다."
        );
        setMealData(null);
      })
      .finally(() => {
        if (!ignore) setIsMealLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [educationOfficeCode, schoolCode, yyyymmdd, token]);

  const periods = useMemo(() => {
    if (!Array.isArray(timetableDays)) return [];
    const day = timetableDays.find((item) => item.date === yyyymmdd);
    if (!day) return [];
    return Array.isArray(day.periods) ? day.periods : [];
  }, [timetableDays, yyyymmdd]);

  const formattedMeal = useMemo(() => {
    if (!mealData) return null;
    const { breakfast, lunch, dinner } = mealData;
    return {
      breakfast: Array.isArray(breakfast) ? breakfast : [],
      lunch: Array.isArray(lunch) ? lunch : [],
      dinner: Array.isArray(dinner) ? dinner : [],
    };
  }, [mealData]);

  const goPrevDate = () => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    setDate(d);
  };

  const goNextDate = () => {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    setDate(d);
  };

  const canRequestData = Boolean(
    educationOfficeCode && schoolCode && grade && klass
  );

  return (
    <Container>
      <Header />
      <ScrollWrapper>
        {canRequestData ? (
          <>
            <ClassLine>
              {grade}학년 {klass}반
            </ClassLine>
            <SubLine>{user?.school ?? "학교 정보 없음"}</SubLine>
          </>
        ) : (
          <HelperBox>
            시간표를 불러오려면 학교, 학년, 반 정보가 필요합니다.
          </HelperBox>
        )}

        <DateBar>
          <DateBtn onClick={goPrevDate}>‹</DateBtn>
          <DateText>{fmtKoreanDate(date)}</DateText>
          <DateBtn onClick={goNextDate}>›</DateBtn>
        </DateBar>

        {canRequestData &&
          (isTimetableLoading ? (
            <LoadingBox>시간표를 불러오는 중입니다...</LoadingBox>
          ) : timetableError ? (
            <ErrorBox>{timetableError}</ErrorBox>
          ) : (
            <TimetableWrap>
              {periods.length > 0 ? (
                periods.map((period, idx) => {
                  const {
                    period: periodNo,
                    subject,
                    teacher,
                    teacher_by_class: teacherByClass,
                  } = period;
                  let teacherText = teacher || "";
                  if (!teacherText && teacherByClass) {
                    const entries = Object.entries(teacherByClass)
                      .map(([klassLabel, name]) => `${klassLabel}: ${name}`)
                      .join(", ");
                    teacherText = entries;
                  }
                  return (
                    <PeriodRow key={periodNo || `${subject}-${idx}`}>
                      <PeriodBadge>
                        {periodNo ? `${periodNo}교시` : "교시"}
                      </PeriodBadge>
                      <Subject>
                        {subject || "과목 미정"}
                        {teacherText && <Teacher>{teacherText}</Teacher>}
                      </Subject>
                    </PeriodRow>
                  );
                })
              ) : (
                <HelperBox>선택한 날짜의 시간표가 없습니다.</HelperBox>
              )}
            </TimetableWrap>
          ))}

        <MealSection>
          <SectionTitle>급식</SectionTitle>
          {canRequestData ? (
            isMealLoading ? (
              <LoadingBox>급식 정보를 불러오는 중입니다...</LoadingBox>
            ) : mealError ? (
              <ErrorBox>{mealError}</ErrorBox>
            ) : formattedMeal ? (
              (() => {
                const titleMap = {
                  breakfast: "아침",
                  lunch: "점심",
                  dinner: "저녁",
                };
                const cards = ["breakfast", "lunch", "dinner"].flatMap(
                  (key) => {
                    const items = formattedMeal[key];
                    if (!items || items.length === 0) return [];
                    return [
                      <MealCard key={key}>
                        <MealHeading>{titleMap[key]}</MealHeading>
                        <MealList>
                          {items.map((menu, idx) => (
                            <MealItem key={`${key}-${idx}`}>{menu}</MealItem>
                          ))}
                        </MealList>
                      </MealCard>,
                    ];
                  }
                );
                if (cards.length === 0) {
                  return <HelperBox>등록된 급식 정보가 없습니다.</HelperBox>;
                }
                return <MealCards>{cards}</MealCards>;
              })()
            ) : (
              <HelperBox>급식 정보를 찾을 수 없습니다.</HelperBox>
            )
          ) : (
            <HelperBox>
              학교 정보를 찾을 수 없어 급식을 표시할 수 없습니다.
            </HelperBox>
          )}
        </MealSection>

        <BottomPad />
      </ScrollWrapper>
      <TabNavigation />
    </Container>
  );
};

export default TimetablePage;
