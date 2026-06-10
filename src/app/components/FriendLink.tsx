'use client';

import { useState, useRef } from 'react';

const FRIENDS = [
  { label: 'justin', href: 'https://www.watshisname-stuutzer.com/' },
  { label: 'lawrence', href: 'https://blackpri0r.dev/' },
  { label: 'jassel', href: 'https://my-portfolio-tau-smoky-10.vercel.app/' },
  { label: 'stas', href: 'https://www.stastigay.com/' },
  { label: 'ayush', href: 'https://yush9.dev/#home' },
  { label: 'violet', href: 'https://violetchen.dev/' },
  { label: 'chris', href: 'https://www.chrischiem.com/' },
];

export default function FriendLink() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 100);
  };

  return (
    <div className="widget" style={{
      position: 'fixed',
      bottom: '1.2rem',
      right: '1.5rem',
      fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
      fontSize: 'clamp(8px, 1vw, 10px)',
      color: '#333',
      userSelect: 'none',
    }}>
      my{' '}
      <span
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{ position: 'relative', display: 'inline-block' }}
      >
        <span className="inline-link" style={{ borderBottom: '0.5px solid currentColor', cursor: 'pointer' }}>
          friends
        </span>
        {open && (
          <div
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 5px)',
              right: 0,
              background: '#1a1a1a',
              border: '1px solid #333',
              padding: '6px 10px',
              display: 'inline-flex',
              flexDirection: 'column',
              gap: '4px',
              whiteSpace: 'nowrap',
              zIndex: 100,
            }}
          >
            {FRIENDS.map((f) => (
              <a
                key={f.href}
                href={f.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
                style={{ color: '#888', textDecoration: 'underline', textDecorationColor: 'rgba(232, 232, 224, 0.3)', textDecorationThickness: '0.5px', fontSize: '10px', display: 'block' }}
              >
                {f.label}
              </a>
            ))}
          </div>
        )}
      </span>
      {' '}have websites too
    </div>
  );
}
