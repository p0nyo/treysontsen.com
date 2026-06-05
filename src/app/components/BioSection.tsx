'use client';

import { useEffect, useRef, useState } from 'react';

const LINE_STYLE: React.CSSProperties = {
  fontSize: "clamp(8px, 1.56vw, 11px)",
  lineHeight: "1.7",
  margin: 0,
};

export default function BioSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(7);

  useEffect(() => {
    const calculate = () => {
      if (!containerRef.current) return;
      const paras = containerRef.current.querySelectorAll('p');
      let total = 0;
      paras.forEach((p) => {
        const style = window.getComputedStyle(p);
        const lineHeightPx = parseFloat(style.lineHeight);
        const lines = Math.round(p.scrollHeight / lineHeightPx);
        total += lines;
      });
      setLineCount(total);
    };
    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, []);

  return (
    <section style={{ display: "flex", flexDirection: "row", gap: "0", marginBottom: "2rem" }}>
      {/* Line numbers */}
      <div style={{ color: "#333", fontSize: "clamp(8px, 1.56vw, 11px)", lineHeight: "1.7", userSelect: "none", textAlign: "right", flexShrink: 0, width: "2em", marginRight: "0.75rem", marginLeft: "calc(-2em - 0.75rem)" }}>
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      {/* Lines */}
      <div ref={containerRef}>
        <p style={{ ...LINE_STYLE, color: "#c8c8c0" }}>
          curr. software engineer @ visa, tech lead @ <a href="https://auec.club/" target="_blank" rel="noopener noreferrer" tabIndex={-1} className="tooltip inline-link" data-tooltip="auec club website" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '0.5px solid currentColor', userSelect: 'text', WebkitUserSelect: 'text' }}>auec</a> and building out a website for the <a href="https://www.instagram.com/_lovevisuals_/" target="_blank" rel="noopener noreferrer" tabIndex={-1} className="tooltip inline-link" data-tooltip="lovevisuals instagram portfolio" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '0.5px solid currentColor', userSelect: 'text', WebkitUserSelect: 'text' }}>lovevisuals</a> photography brand
        </p>
        <p style={{ ...LINE_STYLE, color: "transparent" }}>&nbsp;</p>
        <p style={{ ...LINE_STYLE, color: "#c8c8c0" }}>
          spending most of my time building things that will hopefully make me rich enough to one day buy my life back; obsessed with productivity, systems and tracking anything that I can get my hands on
        </p>
        <p style={{ ...LINE_STYLE, color: "transparent" }}>&nbsp;</p>
        <p style={{ ...LINE_STYLE, color: "#666660" }}>
          {'//'} prev. patty flipper @ mcdonalds and computer science major @ the university of auckland while working on many volunteer software projects for uni clubs and non-profits
        </p>
        <p style={{ ...LINE_STYLE, color: "transparent" }}>&nbsp;</p>
        <p style={{ ...LINE_STYLE, color: "#666660" }}>
          {'//'} usually playing <a href="https://jstris.jezevec10.com/u/ponyoponyo" target="_blank" rel="noopener noreferrer" tabIndex={-1} className="tooltip inline-link" data-tooltip="my jstris profile" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '0.5px solid currentColor', userSelect: 'text', WebkitUserSelect: 'text' }}>tetris</a> or piano in my free time and snowboarding the south island peaks during the winter<span className="cursor" />
        </p>
      </div>
    </section>
  );
}
