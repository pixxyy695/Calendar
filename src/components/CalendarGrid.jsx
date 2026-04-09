import React from "react";
import { DAYS_OF_WEEK, HOLIDAYS, MONTH_NAMES } from "../data/calendarData";

export default function CalendarGrid({
  calendarDays,
  currentYear,
  currentMonth,
  isToday,
  isRangeStart,
  isRangeEnd,
  isInRange,
  isHoverEnd,
  handleDateClick,
  setHoverDate,
  getDayKey,
  theme,
  rangeStart,
  rangeEnd,
  isMobile
}) {
  const { accent, light, dark } = theme;

  const cellH = isMobile ? "42px" : "38px";
  const circleSize = isMobile ? "34px" : "30px";
  const fontSize = isMobile ? "13px" : "12px";

  return (
    <div>
      {/* Month Name */}
      <h2
        style={{
          textAlign: "center",
          marginBottom: "10px",
          fontFamily: '"Cormorant Garamond", serif',
          fontWeight: 600,
          fontSize: isMobile ? "20px" : "24px",
          letterSpacing: "1px",
          color: dark
        }}
      >
        {MONTH_NAMES[currentMonth]} {currentYear}
      </h2>

      {/* Day headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          marginBottom: "6px"
        }}
      >
        {DAYS_OF_WEEK.map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              padding: "4px 0",
              fontFamily: '"DM Sans",sans-serif',
              fontSize: "10px",
              fontWeight: 600,
              borderRadius: "6px",
              background: "#e6dccf", 
              color: i === 0 || i === 6 ? "#b07a50" : "#6b5a45",
              letterSpacing: ".12em"
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: "3px"
        }}
      >
        {calendarDays.map((day, idx) => {
          if (!day)
            return <div key={`e-${idx}`} style={{ height: cellH }} />;

          const key = getDayKey(day);
          const hol = HOLIDAYS[key];

          const today = isToday(day);
          const start = isRangeStart(day);
          const end = isRangeEnd(day) || isHoverEnd(day);
          const inRange = isInRange(day);

          const isWeekend = idx % 7 === 0 || idx % 7 === 6;
          const isEndOnly = end && rangeStart && !isRangeStart(day);

          return (
            <div
              key={key}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: cellH,
                cursor: "pointer",
                transition: "transform .12s ease"
              }}
              onClick={() => handleDateClick(day)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                if (rangeStart && !rangeEnd) {
                  setHoverDate(new Date(currentYear, currentMonth, day));
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                setHoverDate(null);
              }}
            >
              {/* Range background */}
              {inRange && (
                <div
                  style={{
                    position: "absolute",
                    inset: "6px 0",
                    borderRadius: "8px",
                    background: `${light}`,
                    opacity: 0.8
                  }}
                />
              )}

              {/* Start half */}
              {start && (rangeEnd || isHoverEnd(day)) && (
                <div
                  style={{
                    position: "absolute",
                    top: "6px",
                    bottom: "6px",
                    left: "50%",
                    right: 0,
                    background: light
                  }}
                />
              )}

              {/* End half */}
              {isEndOnly && (
                <div
                  style={{
                    position: "absolute",
                    top: "6px",
                    bottom: "6px",
                    left: 0,
                    right: "50%",
                    background: light
                  }}
                />
              )}

              {/* Circle */}
              <div
                style={{
                  position: "relative",
                  zIndex: 10,
                  width: circleSize,
                  height: circleSize,
                  borderRadius: "50%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",

                  background:
                    start || end
                      ? `linear-gradient(135deg, ${accent}, ${dark})`
                      : today
                        ? "#e0d6c8"
                        : "#f0e7db",

                  border:
                    today && !(start || end)
                      ? `1.5px solid ${accent}`
                      : "1px solid #d6cbbb",

                  boxShadow:
                    start || end
                      ? `0 4px 10px ${accent}55`
                      : today
                        ? `0 0 0 3px ${light}`
                        : "0 2px 6px rgba(0,0,0,0.1)"
                }}
              >
                {/* Day */}
                <span
                  style={{
                    fontFamily: '"DM Sans",sans-serif',
                    fontSize,
                    fontWeight: start || end || today ? 700 : 500,
                    color:
                      start || end
                        ? "#080a0a"
                        : isWeekend
                          ? "#b07a50"
                          : "#3c2f1f"
                  }}
                >
                  {day}
                </span>

                {/* Labels */}
                {(start || end) && (
                  <span style={{ fontSize: "6px", color: "black", opacity: 0.85 }}>
                    {start ? "START" : "END"}
                  </span>
                )}

                {/* Holiday */}
                {hol && (
                  <span style={{ fontSize: "9px" }} title={hol.name}>
                    {hol.icon}
                  </span>
                )}

                {/* Today dot */}
                {today && !hol && !(start || end) && (
                  <div
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: accent,
                      marginTop: "2px"
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}