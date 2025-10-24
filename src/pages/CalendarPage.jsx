import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import TabNavigation from "../components/TabNavigation";

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
  margin-top: 10%;
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
  min-height: 70px;
  padding: 8px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease,
    transform 0.05s ease;
  &:hover {
    border-color: #cfe7e4;
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
  color: "#000000";
  transition: background 0.2s ease;
`;

const Events = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
`;

const EventChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  background: #daf2f0;
  color: #008f86;
  border-radius: 9999px;
  padding: 4px 8px;
  width: fit-content;
`;

const DeleteX = styled.button`
  border: none;
  background: transparent;
  color: #008f86;
  font-size: 12px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 17, 17, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalCard = styled.div`
  width: min(480px, calc(100% - 40px));
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 18px 60px rgba(17, 17, 17, 0.18);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #111;
`;

const ModalRow = styled.div`
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  border: 1px solid #e9efee;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: #05baae;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const Button = styled.button`
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
  &.ghost {
    background: #f2fbfa;
    color: #05baae;
  }
  &.primary {
    background: #05baae;
    color: white;
  }
`;

function pad2(n) {
  return n.toString().padStart(2, "0");
}
function ymd(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(
    date.getDate()
  )}`;
}

const CalendarPage = () => {
  // 초기 월을 Oct 2025로 시작 (월: 0=Jan, 9=Oct)
  const [cursor, setCursor] = useState(new Date(2025, 9, 1));

  // 일정: { [yyyy-mm-dd]: [{ id, title }] }
  const [events, setEvents] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [title, setTitle] = useState("");

  // 로컬스토리지 동기화
  useEffect(() => {
    const raw = localStorage.getItem("calendar_events_v1");
    if (raw) {
      try {
        setEvents(JSON.parse(raw));
      } catch {
        // 무시
      }
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("calendar_events_v1", JSON.stringify(events));
  }, [events]);

  // 월 표기 (예: Oct 2025)
  const monthLabel = useMemo(() => {
    return cursor.toLocaleString("en-US", { month: "short", year: "numeric" });
  }, [cursor]);

  // 달력 그리드 날짜들 계산 (6주 고정)
  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startDay = first.getDay(); // 0=Sun
    const start = new Date(first);
    start.setDate(first.getDate() - startDay); // 그 주 일요일로 이동

    const items = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      items.push(d);
    }
    return items;
  }, [cursor]);

  // 오늘
  const todayStr = ymd(new Date());

  // 모달 열기
  const openAdd = (dateObj) => {
    setSelectedDate(dateObj);
    setTitle("");
    setModalOpen(true);
  };

  // 일정 추가
  const addEvent = () => {
    if (!title.trim() || !selectedDate) return;
    const key = ymd(selectedDate);
    setEvents((prev) => {
      const list = prev[key] ? [...prev[key]] : [];
      list.push({ id: Date.now(), title: title.trim() });
      return { ...prev, [key]: list };
    });
    setModalOpen(false);
  };

  // 일정 삭제
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
                onClick={() => openAdd(d)}
              >
                <DateDot>
                  <DateNum $isToday={isToday}>{d.getDate()}</DateNum>
                </DateDot>

                {!!dayEvents.length && (
                  <Events onClick={(e) => e.stopPropagation()}>
                    {dayEvents.map((ev) => (
                      <EventChip key={ev.id} title="클릭하면 삭제">
                        {ev.title}
                        <DeleteX onClick={() => removeEvent(dayKey, ev.id)}>
                          ✕
                        </DeleteX>
                      </EventChip>
                    ))}
                  </Events>
                )}
              </Cell>
            );
          })}
        </Grid>
      </CalendarWrap>

      {modalOpen && (
        <ModalBackdrop onClick={() => setModalOpen(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>
              Add event — {selectedDate && selectedDate.toDateString()}
            </ModalTitle>
            <ModalRow>
              <Input
                autoFocus
                placeholder="Event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addEvent();
                }}
              />
            </ModalRow>
            <ModalActions>
              <Button className="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button className="primary" onClick={addEvent}>
                Add
              </Button>
            </ModalActions>
          </ModalCard>
        </ModalBackdrop>
      )}
      <TabNavigation />
    </Container>
  );
};

export default CalendarPage;
