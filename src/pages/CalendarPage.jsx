import React, { useEffect, useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import Header from "../components/Header";
import TabNavigation from "../components/TabNavigation";

/* === 카테고리 & 색상 고정 매핑 === */
const CATEGORY_COLORS = {
  school: "#5FEC52", // 학교 공식 일정 (초록)
  personal: "#FFD9D9", // 개인 일정 (핑크)
  assignment: "#D2F0FF", // 과제 (파랑)
};
const CATEGORY_KEYS = Object.keys(CATEGORY_COLORS);

/* === 레이아웃 === */
const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 20px;
  overflow: hidden;
`;

const CalendarBar = styled.div`
  width: 100%;
  margin-top: 12%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px 16px;
  box-sizing: border-box;
`;

const MonthNav = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const MonthBtn = styled.button`
  width: 36px;
  font-family: "Font Awesome 5 Pro";
  height: auto;
  border-radius: 10px;
  border: none;
  background: #ffffff;
  color: #000000;
  font-size: 24px;
  font-weight: 100;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.05s ease;
  &:hover {
    background: #f6fbfa;
  }
  &:active {
    transform: translateY(1px);
  }
`;

const MonthTitle = styled.h2`
  margin: 0;
  font-size: 32px;
  font-family: "Gmarket Sans TTF";
  font-weight: 700;
  color: #111;
  margin-right: auto;
`;

const CalendarWrap = styled.div`
  margin-top: 16px;
  width: 100%;
  flex-grow: 1;
  padding: 0 20px 24px;
  box-sizing: border-box;
`;

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  padding: 6px 0 8px;
  color: #7a8a88;
  font-weight: 300;
  font-size: 13px;
  font-family: "Lato";
`;

const Weekday = styled.div`
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
`;

const Cell = styled.button`
  background: #ffffff;
  border: none;
  border-radius: 12px;
  height: 82px;
  padding: 8px;
  min-width: 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  transition: box-shadow 0.15s ease, transform 0.05s ease;
  &:hover {
    box-shadow: 0 2px 10px rgba(5, 186, 174, 0.06);
  }
  &:active {
    transform: translateY(1px);
  }
  ${(p) =>
    p.$isOtherMonth &&
    `
    background: #fbfdfd;
    color: #9ab5b1;
  `}
`;

const DateDot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DateNum = styled.span`
  font-size: 14px;
  font-weight: 300;
  font-family: "Lato";
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${(p) => (p.$isToday ? "#05BAAE" : "transparent")};
  color: #000000;
  transition: background 0.2s ease;
`;

const Events = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
`;

/* 셀 하이라이트: 패딩 없음/가로 100%/제목만(시간 숨김) */
const EventBlock = styled.div`
  width: 100%;
  height: 14px;
  background: ${(p) => p.$color || "#daf2f0"};
  border-radius: 4px;
  padding: 0;
  font-size: 10px;
  line-height: 14px;
  color: #0b3b38;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* === 바텀시트 === */
const SheetBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 17, 17, 0.35);
  z-index: 2000;
`;

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to   { transform: translateY(0%); }
`;

const Sheet = styled.div`
  width: 100%;
  max-height: 80%;
  overflow: auto;
  position: absolute;
  bottom: 0;
  z-index: 2001;
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -12px 40px rgba(17, 17, 17, 0.18);
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 220ms ease-out;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
`;

const SheetHandle = styled.div`
  align-self: center;
  width: 44px;
  height: 5px;
  border-radius: 9999px;
  background: #e9efee;
  margin: 10px 0 24px;
`;

const SheetScroll = styled.div`
  overflow: auto;
  padding: 0 18px 80px;
`;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 8px 0 16px;
`;

const EmptyState = styled.div`
  color: #8aa6a1;
  font-size: 13px;
  text-align: center;
  margin-bottom: 12px;
`;

const EventRow = styled.div`
  display: grid;
  grid-template-columns: 10px 64px 1fr auto; /* 컬러 / 시간 / 제목 / 삭제 */
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #eef4f3;
  border-radius: 12px;
`;

const ColorStrip = styled.span`
  width: 6px;
  height: 100%;
  border-radius: 4px;
  background: ${(p) => p.$color || "#05BAAE"};
  justify-self: center;
`;

const EventTime = styled.span`
  font-size: 13px;
  color: #0b3b38;
  font-family: "Lato";
`;

const EventName = styled.span`
  font-size: 13px;
  color: #0b3b38;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RemoveBtn = styled.button`
  border: none;
  background: transparent;
  color: #9fb7b3;
  font-weight: 900;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  &:hover {
    color: #e06161;
  }
`;

/* 입력: 시간(24h) / 카테고리 / 제목 */
// ⭐ 변경된 부분 1: flex-direction: column
const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
`;

// ⭐ 추가된 부분: 시간과 카테고리를 묶어 1:1로 배치
const HalfWidthRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const TimeInput = styled.input`
  border: none;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
`;

const Select = styled.select`
  border: none;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  background: #fff;
`;

const TextInput = styled.input`
  border: none;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
`;

const PlusRow = styled.div`
  position: sticky;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 30%);
  padding: 22px 18px 8px;
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
`;

const PlusBtn = styled.button`
  border: none;
  border-radius: 9999px;
  margin-bottom: 12px;
  padding: 12px 28px;
  font-weight: 300;
  font-size: 24px;
  background: transparent;
  color: #000000;
  cursor: pointer;
  box-shadow: none;
  &:active {
    transform: translateY(1px);
  }
`;

/* === utils === */
function pad2(n) {
  return n.toString().padStart(2, "0");
}
function ymd(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(
    date.getDate()
  )}`;
}
function nowTime() {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
function shortTitle(t) {
  const s = (t || "").trim();
  if (s.length <= 16) return s;
  return s.slice(0, 16) + "…";
}

/* === category 정규화 === */
function normalizeCategory(raw) {
  if (!raw) return "personal";
  const v = String(raw).toLowerCase().trim();

  // 정확한 키면 그대로
  if (CATEGORY_KEYS.includes(v)) return v;

  // 색(hex)로 들어온 경우 매핑
  const hex = v.toUpperCase();
  if (hex === "#5FEC52") return "school";
  if (hex === "#FFD9D9") return "personal";
  if (hex === "#D2F0FF") return "assignment";

  // 부분 포함(예: rgba or 저장 포맷 변형)
  if (hex.includes("5FEC52")) return "school";
  if (hex.includes("FFD9D9")) return "personal";
  if (hex.includes("D2F0FF")) return "assignment";

  // 나머지는 개인 일정으로
  return "personal";
}

/* === 메인 컴포넌트 === */
const CalendarPage = () => {
  const [cursor, setCursor] = useState(new Date(2025, 9, 1));
  // { [date]: [{ id, title, time, category }] }
  const [events, setEvents] = useState({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // 입력값
  const [time, setTime] = useState(nowTime());
  const [category, setCategory] = useState("personal");
  const [title, setTitle] = useState("");

  // 스토리지 → 최신 스키마로 마이그레이션
  useEffect(() => {
    const raw = localStorage.getItem("calendar_events_v1");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      const fixed = Object.fromEntries(
        Object.entries(parsed).map(([k, list]) => [
          k,
          (list || []).map((e) => ({
            id: e.id,
            title: e.title ?? "",
            time: e.time ?? "09:00",
            // e.category가 있든, e.color만 있든, 이상한 문자열이든 모두 정규화
            category: normalizeCategory(e.category || e.color || "personal"),
          })),
        ])
      );
      setEvents(fixed);
    } catch {
      console.error("Failed to parse calendar events from storage");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendar_events_v1", JSON.stringify(events));
  }, [events]);

  // 시트 열릴 때 스크롤바 점프 방지
  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    if (sheetOpen) {
      const prevOverflow = body.style.overflow;
      const prevPaddingRight = body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - root.clientWidth;
      body.style.overflow = "hidden";
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
      return () => {
        body.style.overflow = prevOverflow;
        body.style.paddingRight = prevPaddingRight;
      };
    }
  }, [sheetOpen]);

  const monthLabel = useMemo(() => {
    return cursor.toLocaleString("en-US", { month: "short", year: "numeric" });
  }, [cursor]);

  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startDay = first.getDay();
    const start = new Date(first);
    start.setDate(first.getDate() - startDay);
    const items = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      items.push(d);
    }
    return items;
  }, [cursor]);

  const todayStr = ymd(new Date());

  const openSheet = (dateObj) => {
    setSelectedDate(dateObj);
    setTime(nowTime());
    setCategory("personal");
    setTitle("");
    setSheetOpen(true);
  };

  const addEvent = () => {
    if (!title.trim() || !selectedDate) return;
    const key = ymd(selectedDate);
    const safeCategory = normalizeCategory(category);
    setEvents((prev) => {
      const list = prev[key] ? [...prev[key]] : [];
      list.push({
        id: Date.now(),
        title: title.trim(),
        time,
        category: safeCategory,
      });
      list.sort((a, b) => (a.time > b.time ? 1 : a.time < b.time ? -1 : 0));
      return { ...prev, [key]: list };
    });
    setTime(nowTime());
    setCategory("personal");
    setTitle("");
    // setSheetOpen(false); // 시트가 닫히지 않도록 주석 처리 (연속 입력 용이)
  };

  const removeEvent = (key, id) => {
    setEvents((prev) => {
      const list = (prev[key] || []).filter((e) => e.id !== id);
      const next = { ...prev };
      if (list.length) next[key] = list;
      else delete next[key];
      return next;
    });
  };

  const weekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Container>
      <Header />
      <CalendarBar>
        <MonthNav>
          <MonthTitle as="div">
            <span style={{ fontWeight: 900 }}>{monthLabel.split(" ")[0]}</span>{" "}
            <span style={{ fontWeight: 300 }}>{monthLabel.split(" ")[1]}</span>
          </MonthTitle>
          <MonthBtn
            aria-label="Previous month"
            onClick={() =>
              setCursor(
                new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
              )
            }
          >
            &lt;
          </MonthBtn>
          <MonthBtn
            aria-label="Next month"
            onClick={() =>
              setCursor(
                new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
              )
            }
          >
            &gt;
          </MonthBtn>
        </MonthNav>
      </CalendarBar>

      <CalendarWrap>
        <WeekHeader>
          {weekNames.map((w) => (
            <Weekday key={w}>{w}</Weekday>
          ))}
        </WeekHeader>

        <Grid>
          {days.map((d) => {
            const dayKey = ymd(d);
            const isOtherMonth = d.getMonth() !== cursor.getMonth();
            const isToday = dayKey === todayStr;
            const dayEvents = events[dayKey] || [];

            if (isOtherMonth) {
              return <div key={dayKey} style={{ visibility: "hidden" }} />;
            }

            return (
              <Cell
                key={dayKey}
                $isOtherMonth={isOtherMonth}
                $isToday={isToday}
                onClick={() => openSheet(d)}
              >
                <DateDot>
                  <DateNum $isToday={isToday}>{d.getDate()}</DateNum>
                </DateDot>

                {!!dayEvents.length && (
                  <Events onClick={(e) => e.stopPropagation()}>
                    {dayEvents.slice(0, 2).map((ev) => {
                      const cat = normalizeCategory(ev.category);
                      const color = CATEGORY_COLORS[cat] || "#daf2f0";
                      return (
                        <EventBlock
                          key={ev.id}
                          $color={color}
                          title={`${ev.time} · ${ev.title}`}
                        >
                          {shortTitle(ev.title)}
                        </EventBlock>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <span style={{ fontSize: 10, color: "#7a8a88" }}>
                        + {dayEvents.length - 2} more
                      </span>
                    )}
                  </Events>
                )}
              </Cell>
            );
          })}
        </Grid>
      </CalendarWrap>

      {sheetOpen && (
        <>
          <SheetBackdrop onClick={() => setSheetOpen(false)} />
          <Sheet
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <SheetHandle />
            <SheetScroll>
              <EventsList>
                {(() => {
                  const key = selectedDate ? ymd(selectedDate) : "";
                  const list = events[key] || [];
                  if (list.length === 0) {
                    return (
                      <EmptyState>
                        아직 일정이 없습니다. 아래에서 추가해보세요.
                      </EmptyState>
                    );
                  }
                  return list.map((ev) => {
                    const cat = normalizeCategory(ev.category);
                    const color = CATEGORY_COLORS[cat] || "#daf2f0";
                    return (
                      <EventRow key={ev.id}>
                        <ColorStrip $color={color} />
                        <EventTime>{ev.time}</EventTime>
                        <EventName>{ev.title}</EventName>
                        <RemoveBtn
                          onClick={() => removeEvent(key, ev.id)}
                          aria-label="삭제"
                          title="삭제"
                        >
                          ×
                        </RemoveBtn>
                      </EventRow>
                    );
                  });
                })()}
              </EventsList>

              {/* 입력 레이아웃 변경 적용 */}
              <InputRow>
                {/* 1행: 시간 + 카테고리 (1:1 분할) */}
                <HalfWidthRow>
                  <TimeInput
                    type="time"
                    lang="ko-KR"
                    step="60"
                    min="00:00"
                    max="23:59"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="school">학교 공식 일정</option>
                    <option value="personal">개인 일정</option>
                    <option value="assignment">과제</option>
                  </Select>
                </HalfWidthRow>

                {/* 2행: 일정 이름 (전체 너비) */}
                <TextInput
                  placeholder="일정 이름"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.nativeEvent.isComposing) return;
                    if (e.key === "Enter") addEvent();
                  }}
                />
              </InputRow>
            </SheetScroll>

            <PlusRow>
              <PlusBtn onClick={addEvent}>＋</PlusBtn>
            </PlusRow>
          </Sheet>
        </>
      )}

      <TabNavigation />
    </Container>
  );
};

export default CalendarPage;
