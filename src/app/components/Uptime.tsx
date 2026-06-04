'use client';

import { useEffect, useState } from 'react';

const LAUNCH = new Date('2026-06-04T12:00:00');

function getUptime() {
  const diff = Date.now() - LAUNCH.getTime();
  const totalSeconds = Math.floor(diff / 1000);
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

export default function Uptime() {
  const [uptime, setUptime] = useState('');

  useEffect(() => {
    const update = () => setUptime(getUptime());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '1.2rem',
      left: '1.5rem',
      fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
      fontSize: 'clamp(9px, 1.4vw, 13px)',
      color: '#444',
      letterSpacing: '0.05em',
      userSelect: 'none',
      lineHeight: '1.6',
    }}>
      <div>online for</div>
      <div>{uptime}</div>
    </div>
  );
}
