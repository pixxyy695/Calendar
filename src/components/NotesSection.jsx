import React, { useState, useEffect, useRef } from 'react';
import { lsGet, lsSet, monthNoteKey, rangeNotesKey } from "../utils/localStorage";

function NotesSection({ curYear, curMonth, monthName, theme, rangeStart, rangeEnd }) {
  const { accent } = theme;

  const [activeTab, setActiveTab] = useState("month");
  const [monthNote, setMonthNote] = useState("");
  const [monthSaved, setMonthSaved] = useState(false);
  const [rangeNoteText, setRangeNoteText] = useState("");
  const [rangeSaved, setRangeSaved] = useState(false);
  const [rangeNotes, setRangeNotes] = useState([]);
  const savedTimerRef = useRef(null);

  // Load data
  useEffect(() => {
    setMonthNote(lsGet(monthNoteKey(curYear, curMonth), ""));
    setRangeNotes(lsGet(rangeNotesKey(curYear, curMonth), []));
  }, [curYear, curMonth]);

  // FIXED: allow manual tab switching
  useEffect(() => {
    if (rangeStart && activeTab !== "range") {
      setActiveTab("range");
    }
  }, [rangeStart]);

  const saveMonthNote = () => {
    lsSet(monthNoteKey(curYear, curMonth), monthNote);
    setMonthSaved(true);
    clearTimeout(savedTimerRef.current);
    savedTimerRef.current = setTimeout(() => setMonthSaved(false), 1500);
  };

  const saveRangeNote = () => {
    const text = rangeNoteText.trim();
    if (!text || !rangeStart) return;

    const opts = { month: "short", day: "numeric" };
    let label = rangeStart.toLocaleDateString("en-US", opts);
    if (rangeEnd && rangeEnd.toDateString() !== rangeStart.toDateString()) {
      label += " – " + rangeEnd.toLocaleDateString("en-US", opts);
    }

    const newNote = { id: Date.now(), label, text };
    const updated = [newNote, ...rangeNotes];

    setRangeNotes(updated);
    lsSet(rangeNotesKey(curYear, curMonth), updated);

    setRangeNoteText("");
    setRangeSaved(true);

    clearTimeout(savedTimerRef.current);
    savedTimerRef.current = setTimeout(() => setRangeSaved(false), 1500);
  };

  const deleteRangeNote = (id) => {
    const updated = rangeNotes.filter(n => n.id !== id);
    setRangeNotes(updated);
    lsSet(rangeNotesKey(curYear, curMonth), updated);
  };

  const rangeLabel = (() => {
    if (!rangeStart) return null;
    const opts = { month: "short", day: "numeric", year: "numeric" };
    let label = rangeStart.toLocaleDateString("en-US", opts);
    if (rangeEnd && rangeEnd.toDateString() !== rangeStart.toDateString()) {
      label += " – " + rangeEnd.toLocaleDateString("en-US", opts);
    }
    return label;
  })();

  const tabStyle = (tab) => ({
    fontFamily: '"DM Sans",sans-serif',
    fontSize: "11px",
    fontWeight: 600,
    padding: "5px 14px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    transition: "all .2s",
    background: activeTab === tab
      ? `linear-gradient(135deg, ${accent}, #7c5c3b)`
      : "rgba(120,100,80,.08)",
    color: activeTab === tab ? "#2a5456" : "#6b5845",
    boxShadow: activeTab === tab ? "0 2px 6px rgba(0,0,0,0.2)" : "none"
  });

  const saveBtn = () => ({
    fontFamily: '"DM Sans",sans-serif',
    fontSize: "10px",
    fontWeight: 700,
    padding: "5px 12px",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    background: `linear-gradient(135deg, ${accent}, #7c5c3b)`,
    color: "#2a5456",
    boxShadow: "0 2px 5px rgba(0,0,0,0.25)"
  });

  const textareaStyle = {
    width: "100%",
    border: "1.5px solid rgba(120,100,80,.25)",
    borderRadius: "12px",
    background: "linear-gradient(to bottom, #fffdf8, #f6efe4)",
    fontFamily: '"Cormorant Garamond",serif',
    fontSize: "14px",
    color: "#2c241c",
    padding: "10px 12px",
    resize: "vertical",
    minHeight: "70px",
    lineHeight: 1.6,
    outline: "none",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)"
  };

  return (
    <div style={{ marginTop: "14px", borderTop: "1px solid rgba(120,100,80,.2)", paddingTop: "12px" }}>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
        <button style={tabStyle("month")} onClick={() => setActiveTab("month")}>📋 Month Notes</button>
        <button style={tabStyle("range")} onClick={() => setActiveTab("range")}>📅 Range Notes</button>
      </div>

      {/* MONTH */}
      {activeTab === "month" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "13px", color: "#5b4836", fontStyle: "italic" }}>
              Memo for {monthName} {curYear}
            </span>

            <div style={{ display: "flex", gap: "8px" }}>
              {monthSaved && <span style={{ fontSize: "10px", color: accent }}>✓ Saved</span>}
              <button style={saveBtn()} onClick={saveMonthNote}>Save</button>
            </div>
          </div>

          <textarea
            style={textareaStyle}
            value={monthNote}
            onChange={e => setMonthNote(e.target.value)}
            placeholder="Write your monthly notes..."
          />
        </div>
      )}

      {/* RANGE */}
      {activeTab === "range" && (
        <div>

          {rangeStart ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", color: "#5b4836", fontStyle: "italic" }}>
                  {rangeLabel}
                </span>

                <div style={{ display: "flex", gap: "8px" }}>
                  {rangeSaved && <span style={{ fontSize: "10px", color: accent }}>✓ Added</span>}
                  <button style={saveBtn()} onClick={saveRangeNote}>Add</button>
                </div>
              </div>

              <textarea
                style={textareaStyle}
                value={rangeNoteText}
                onChange={e => setRangeNoteText(e.target.value)}
                placeholder="Write note for selected dates..."
              />
            </>
          ) : (
            <p style={{ fontSize: "13px", color: "#9c8a74", fontStyle: "italic" }}>
              Select a date range first
            </p>
          )}

          {/* LIST */}
          <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {rangeNotes.map(note => (
              <div key={note.id} style={{
                background: "linear-gradient(to bottom, #fffdf8, #f4ecdf)",
                border: "1px solid rgba(120,100,80,.22)",
                borderRadius: "8px",
                padding: "7px 10px",
                position: "relative"
              }}>
                <div style={{ fontSize: "10px", color: "#8a6f55", marginBottom: "3px" }}>
                  {note.label}
                </div>

                <div style={{ fontSize: "13px", color: "#2c241c" }}>
                  {note.text}
                </div>

                <button
                  onClick={() => deleteRangeNote(note.id)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "8px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "#b08a6a"
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

export default NotesSection;