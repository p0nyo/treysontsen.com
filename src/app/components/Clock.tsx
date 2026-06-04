'use client';

import { useEffect, useState } from 'react';

export default function Clock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="widget" style={{
      position: 'fixed',
      top: '1.2rem',
      right: '1.5rem',
      fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
      fontSize: 'clamp(9px, 1.4vw, 13px)',
      color: '#444',
      letterSpacing: '0.05em',
      userSelect: 'none',
      textAlign: 'right',
      lineHeight: '1.6',
    }}>
      <div style={{ fontSize: 'clamp(15px, 2.4vw, 22px)' }}>{time}</div>
      <div>auckland, nz</div>
    </div>
  );
}
