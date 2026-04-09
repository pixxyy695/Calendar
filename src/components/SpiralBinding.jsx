import React from "react";

export default function SpiralBinding() {
  const columns = 7; // number of loops in the spiral binding

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        background: "#e9e9e9",
        paddingTop: "18px",
        paddingBottom: "10px"
      }}
    >
      {/* GRID aligned with calendar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          alignItems: "end",
          width: "100%",
          position: "relative",
          zIndex: 2 
        }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
              height: "40px"
            }}
          >
            {/* LEFT LOOP */}
            <div
              style={{
                position: "absolute",
                left: "calc(50% - 8px)",
                top: "0",
                width: "8px",
                height: "26px",
                border: "2px solid #444",
                borderRadius: "50px",
                borderBottom: "none"
              }}
            />

            {/* RIGHT LOOP */}
            <div
              style={{
                position: "absolute",
                left: "calc(50% + 2px)",
                top: "0",
                width: "8px",
                height: "26px",
                border: "2px solid #444",
                borderRadius: "50px",
                borderBottom: "none"
              }}
            />

            {/* BLACK BASE DOT (hole connection) */}
            <div
              style={{
                position: "absolute",
                bottom: "4px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#111",
                boxShadow: "0 2px 3px rgba(0,0,0,0.4)"
              }}
            />

            {/* SHADOW */}
            <div
              style={{
                position: "absolute",
                bottom: "2px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "16px",
                height: "6px",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.15)",
                filter: "blur(2px)"
              }}
            />
          </div>
        ))}
      </div>

      {/* PAGE TOP EDGE */}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: 0,
          width: "100%",
          height: "14px",
          background: "#f5efe6",
          zIndex: 1
        }}
      />
    </div>
  );
}