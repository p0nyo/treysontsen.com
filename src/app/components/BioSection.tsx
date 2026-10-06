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
        {/* <p style={{ ...LINE_STYLE, color: "#c8c8c0" }}>
          curr. software engineer @ visa, tech lead @ <a href="https://auec.club/" target="_blank" rel="noopener noreferrer" tabIndex={-1} className="tooltip inline-link" data-tooltip="auec club website" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '0.5px solid currentColor', userSelect: 'text', WebkitUserSelect: 'text' }}>auec</a> and designing/developing a website for the <a href="https://www.instagram.com/_lovevisuals_/" target="_blank" rel="noopener noreferrer" tabIndex={-1} className="tooltip inline-link" data-tooltip="lovevisuals instagram portfolio" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '0.5px solid currentColor', userSelect: 'text', WebkitUserSelect: 'text' }}>lovevisuals</a> photography brand
        </p> */}
        <p style={{ ...LINE_STYLE, color: "#c8c8c0" }}>
          software engineer with a mandatory hatred for all things bureaucratic; anxious about the future of my career like many others in my field, but still doomscrolling inbetween prompts as if it somehow helps my whole situation
        </p>
        
        <p style={{ ...LINE_STYLE, color: "transparent" }}>&nbsp;</p>
        <p style={{ ...LINE_STYLE, color: "#c8c8c0" }}>
          i spend most of my time outside of work building b2c apps, chasing the fabled $10k mrr - which will hopefully be enough to one day buy back the life i sold to corporate
        </p>
        <p style={{ ...LINE_STYLE, color: "transparent" }}>&nbsp;</p>
        <p style={{ ...LINE_STYLE, color: "#666660" }}>
          {'//'} prev. patty flipper @ mcdonalds and computer science major @ the university of auckland while doing unpaid software work for uni clubs and non-profits
        </p>
        <p style={{ ...LINE_STYLE, color: "transparent" }}>&nbsp;</p>
        {/* <p style={{ ...LINE_STYLE, color: "#666660" }}>
          {'//'} usually playing <a href="https://jstris.jezevec10.com/u/ponyoponyo" target="_blank" rel="noopener noreferrer" tabIndex={-1} className="tooltip inline-link" data-tooltip="my jstris profile" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '0.5px solid currentColor', userSelect: 'text', WebkitUserSelect: 'text' }}>tetris</a> or piano in my free time and snowboarding the south island <a href="https://www.queenstownnz.co.nz/stories/post/a-guide-to-south-island-ski-fields/" target="_blank" rel="noopener noreferrer" tabIndex={-1} className="tooltip inline-link" data-tooltip="a guide to south island ski fields" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '0.5px solid currentColor', userSelect: 'text', WebkitUserSelect: 'text' }}>peaks</a> during the winter; also obsessed with productivity and creating systems in an attempt to improve my quality of work and life <span className="cursor" /> 
        </p> */}
        <p style={{ ...LINE_STYLE, color: "#666660" }}>
          {'//'} hobbies include <a href="https://jstris.jezevec10.com/u/ponyoponyo" target="_blank" rel="noopener noreferrer" tabIndex={-1} className="tooltip inline-link" data-tooltip="my jstris profile" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '0.5px solid currentColor', userSelect: 'text', WebkitUserSelect: 'text' }}>tetris</a>, piano and snowboarding the <a href="https://www.queenstownnz.co.nz/stories/post/a-guide-to-south-island-ski-fields/" target="_blank" rel="noopener noreferrer" tabIndex={-1} className="tooltip inline-link" data-tooltip="a guide to south island ski fields" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '0.5px solid currentColor', userSelect: 'text', WebkitUserSelect: 'text' }}>peaks</a> during the winter; also obsessed with productivity and creating systems in an attempt to improve my quality of work and life<span className="cursor" /> 
        </p>
      </div>
    </section>
  );
}
