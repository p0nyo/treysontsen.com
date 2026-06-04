'use client';

import { useEffect, useState } from 'react';

function getDayInfo() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const day = Math.floor(diff / 86400000);
  const isLeap = (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || now.getFullYear() % 400 === 0;
  const total = isLeap ? 366 : 365;
  return { day, total };
}

export default function DayOfYear() {
  const [info, setInfo] = useState({ day: 0, total: 365 });

  useEffect(() => {
    setInfo(getDayInfo());
  }, []);

  return (
    <div className="widget" style={{
      position: 'fixed',
      top: '1.2rem',
      left: '1.5rem',
      fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
      color: '#444',
      letterSpacing: '0.05em',
      userSelect: 'none',
      textAlign: 'left',
      lineHeight: '1.6',
    }}>
      <div style={{ fontSize: 'clamp(15px, 2.4vw, 22px)' }}>{info.day}/{info.total}</div>
      <div style={{ fontSize: 'clamp(9px, 1.4vw, 13px)' }}>days left</div>
    </div>
  );
}
