import React, { useState } from 'react';
import { MONTH_IMAGES } from '../data/calendarData';

export default function HeroImage({ month, year, monthName, isMobile }) {
  const [loaded, setLoaded] = useState(false);
  const t = MONTH_IMAGES[month];
  const heroH = isMobile ? "200px" : "330px";

  return (
    <div style={{ position: "relative", height: heroH, overflow: "hidden" }}>

      {/* Placeholder */}
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg,#e8e0d0,#d8d0c0)"
          }}
        />
      )}

      {/* Image */}
      <img
        src={t.url}
        alt={`${monthName} ${year}`}
        onLoad={() => setLoaded(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity .8s ease, transform 6s ease",
          transform: loaded ? "scale(1.05)" : "scale(1)",
          filter: "saturate(1.15) contrast(1.05)"
        }}
      />

      {/* Gradient overlay (top → bottom) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.45))"
        }}
      />

      {/* Vignette (edges darker for focus) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.35))"
        }}
      />

      {/* Month + Year Text */}
      <div
        style={{
          position: "absolute",
          bottom: isMobile ? "16px" : "22px",
          left: isMobile ? "16px" : "22px",
          color: "#fff",
          textShadow: "0 3px 10px rgba(0,0,0,0.4)"
        }}
      >
        <div
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: isMobile ? "26px" : "40px",
            fontWeight: 600,
            letterSpacing: "1px"
          }}
        >
          {monthName}
        </div>

        <div
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: isMobile ? "12px" : "14px",
            opacity: 0.9,
            marginTop: "2px"
          }}
        >
          {year}
        </div>
      </div>
    </div>
  );
}