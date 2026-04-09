
import React, { useState, useCallback, useMemo, useEffect } from "react";

import SpiralBinding from "../components/SpiralBinding";
import HeroImage from "../components/HeroImage";
import CalendarGrid from "../components/CalendarGrid";
import NotesSection from "../components/NotesSection";

import { MONTH_NAMES, MONTH_IMAGES } from "../data/calendarData";

export default function WallCalendar() {
  const today = new Date();
  const [curYear, setCurYear] = useState(today.getFullYear());
  const [curMonth, setCurMonth] = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState("next");
  const [animKey, setAnimKey] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 600);
 
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
 
  const theme = MONTH_IMAGES[curMonth];
  const monthName = MONTH_NAMES[curMonth];
 
  const navigateMonth = useCallback((dir) => {
    if (isFlipping) return;
    setFlipDir(dir); setIsFlipping(true);
    setTimeout(() => {
      if (dir === "next") { if (curMonth === 11) { setCurMonth(0); setCurYear(y => y + 1); } else setCurMonth(m => m + 1); }
      else { if (curMonth === 0) { setCurMonth(11); setCurYear(y => y - 1); } else setCurMonth(m => m - 1); }
      setIsFlipping(false); setAnimKey(k => k + 1);
    }, 420);
  }, [curMonth, isFlipping]);
 
  const handleDateClick = useCallback((day) => {
    const d = new Date(curYear, curMonth, day);
    if (!rangeStart || (rangeStart && rangeEnd)) { setRangeStart(d); setRangeEnd(null); }
    else { if (d < rangeStart) { setRangeEnd(rangeStart); setRangeStart(d); } else setRangeEnd(d); }
    setHoverDate(null);
  }, [curYear, curMonth, rangeStart, rangeEnd]);
 
  const calendarDays = useMemo(() => {
    const days = [];
    const firstDay = new Date(curYear, curMonth, 1).getDay();
    const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [curYear, curMonth]);
 
  const isToday = (day) => today.getDate() === day && today.getMonth() === curMonth && today.getFullYear() === curYear;
  const isRangeStart = (day) => rangeStart && rangeStart.toDateString() === new Date(curYear, curMonth, day).toDateString();
  const isRangeEnd = (day) => rangeEnd && rangeEnd.toDateString() === new Date(curYear, curMonth, day).toDateString();
  const isHoverEnd = (day) => !rangeEnd && hoverDate && hoverDate.toDateString() === new Date(curYear, curMonth, day).toDateString();
  const isInRange = (day) => {
    if (!rangeStart) return false;
    const d = new Date(curYear, curMonth, day);
    const end = rangeEnd || hoverDate;
    if (!end) return false;
    const [s, e] = rangeStart < end ? [rangeStart, end] : [end, rangeStart];
    return d > s && d < e;
  };
  const getDayKey = (day) => `${curYear}-${String(curMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  const getRangeLabel = () => {
    if (!rangeStart) return null;
    const opts = { month:"short", day:"numeric" };
    return rangeEnd
      ? `${rangeStart.toLocaleDateString("en-US",opts)} – ${rangeEnd.toLocaleDateString("en-US",opts)}`
      : rangeStart.toLocaleDateString("en-US",opts);
  };
 
  const gridProps = { calendarDays, currentYear:curYear, currentMonth:curMonth, isToday, isRangeStart, isRangeEnd, isInRange, isHoverEnd, handleDateClick, setHoverDate, getDayKey, theme, rangeStart, rangeEnd, isMobile };
 
  const notesProps = { curYear, curMonth, monthName, theme, rangeStart, rangeEnd };
 
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"flex-start", justifyContent:"center", padding: isMobile ? "16px 10px" : "24px 16px", background:"linear-gradient(145deg,#d8d0c0 0%,#c8bfae 40%,#b8b0a0 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes flipPageNext {
          0%{transform:perspective(1100px) rotateX(0);opacity:1}
          35%{transform:perspective(1100px) rotateX(-20deg) translateZ(18px);opacity:1}
          75%{transform:perspective(1100px) rotateX(-140deg) translateZ(8px);opacity:.5}
          100%{transform:perspective(1100px) rotateX(-180deg);opacity:0}
        }
        @keyframes flipPagePrev {
          0%{transform:perspective(1100px) rotateX(0);opacity:1}
          35%{transform:perspective(1100px) rotateX(20deg) translateZ(18px);opacity:1}
          75%{transform:perspective(1100px) rotateX(140deg) translateZ(8px);opacity:.5}
          100%{transform:perspective(1100px) rotateX(180deg);opacity:0}
        }
        @keyframes reveal { 0%{opacity:0;transform:translateY(5px) scale(.99)} 100%{opacity:1;transform:none} }
        @keyframes shadowPulse { 0%{opacity:0} 40%{opacity:1} 100%{opacity:0} }
        @keyframes notesIn { 0%{opacity:0;transform:translateY(5px)} 100%{opacity:1;transform:none} }
        textarea:focus { border-color: rgba(180,160,130,.55) !important; box-shadow: 0 0 0 3px rgba(180,160,130,.12) !important; }
        textarea::placeholder { color:#b8a898; font-style:italic; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(180,160,130,.4); border-radius:4px; }
      `}</style>
 

      <div style={{ width:"100%", maxWidth: isMobile ? "420px" : "900px", position:"relative" }}>
        {/* Shadow */}
        <div style={{ position:"absolute", inset:0, borderRadius:"18px", transform:"translateY(10px) scale(.97)", background:"rgba(0,0,0,.28)", filter:"blur(22px)", zIndex:0 }} />
 
        {/* Card */}
        <div style={{ position:"relative", borderRadius:"18px", overflow:"hidden", background:"#f7f3eb", boxShadow:"0 28px 80px rgba(0,0,0,.22),0 8px 24px rgba(0,0,0,.1),inset 0 1px 0 rgba(255,255,255,.85)", zIndex:1 }}>
 
          {/* Spiral bar */}
          <div style={{ background:"linear-gradient(to bottom,#e8e0d0,#ddd5c5)", borderBottom:"1px solid rgba(180,160,130,.35)" }}>
            <SpiralBinding count={isMobile ? 10 : 20} />
          </div>
 
          {/* Flip + content */}
          <div style={{ position:"relative" }}>
            {isFlipping && (
              <>
                <div style={{
                  position:"absolute", inset:0, zIndex:100, pointerEvents:"none",
                  transformOrigin: flipDir==="next" ? "top center" : "bottom center",
                  animation: flipDir==="next" ? "flipPageNext .52s cubic-bezier(.4,0,.2,1) forwards" : "flipPagePrev .52s cubic-bezier(.4,0,.2,1) forwards",
                  borderRadius:"0 0 18px 18px",
                }}>
                  <div style={{ position:"absolute", inset:0, background:"#f7f3eb", opacity:.92 }} />
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"80px", background:"linear-gradient(to top,rgba(0,0,0,.1),transparent)" }} />
                </div>
                <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.07)", animation:"shadowPulse .52s ease forwards", zIndex:101, pointerEvents:"none", borderRadius:"0 0 18px 18px" }} />
              </>
            )}
 
            <div key={animKey} style={{ animation:"reveal .38s ease forwards" }}>
              {/* Hero */}
              <div style={{ position:"relative" }}>
                <HeroImage month={curMonth} year={curYear} monthName={monthName} isMobile={isMobile} />
                {/* Nav buttons */}
                <div style={{ position:"absolute", bottom:"20px", right:"24px", zIndex:20, display:"flex", gap:"8px" }}>
                  {["prev","next"].map(dir => (
                    <button key={dir} onClick={() => navigateMonth(dir)} disabled={isFlipping}
                      style={{ width:"36px", height:"36px", borderRadius:"50%", border:"none", cursor:isFlipping?"default":"pointer", background:"rgba(255,255,255,.25)", backdropFilter:"blur(8px)", color:"#fff", fontSize:"20px", display:"flex", alignItems:"center", justifyContent:"center", opacity:isFlipping?.35:1, transition:"all .15s" }}>
                      {dir === "prev" ? "‹" : "›"}
                    </button>
                  ))}
                </div>
              </div>
 
              {/* Calendar + Notes section */}
              <div style={{ padding: isMobile ? "12px 14px 16px" : "14px 22px 18px" }}>
 
                {/* Range indicator bar */}
                {rangeStart && (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 12px", borderRadius:"8px", marginBottom:"10px", background:`${theme.light}90`, border:`1px solid ${theme.accent}35`, fontFamily:'"DM Sans",sans-serif', fontSize:"12px", color:theme.dark }}>
                    <span>📅 {getRangeLabel()}</span>
                    <button onClick={() => { setRangeStart(null); setRangeEnd(null); setHoverDate(null); }}
                      style={{ background:"none", border:"none", cursor:"pointer", color:theme.accent, fontSize:"15px", padding:"0 4px", lineHeight:1 }}>×</button>
                  </div>
                )}
 
                {/* Calendar grid */}
                <CalendarGrid {...gridProps} />
 
                {/* Notes */}
                <NotesSection {...notesProps} />
              </div>
            </div>
          </div>
 
          <div style={{ height:"5px", background:"linear-gradient(to bottom,rgba(0,0,0,.04),transparent)", borderTop:"1px solid rgba(180,160,130,.18)" }} />
        </div>
      </div>
    </div>
  );
}