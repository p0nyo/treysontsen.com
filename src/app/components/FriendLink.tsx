'use client';

import { useRef } from 'react';

const FRIENDS = [
  'https://www.watshisname-stuutzer.com/',
  'https://blackpri0r.dev/',
  'https://my-portfolio-tau-smoky-10.vercel.app/',
  'https://www.stastigay.com/',
  'https://yush9.dev/#home',
];

export default function FriendLink() {
  const index = useRef(Math.floor(Math.random() * FRIENDS.length));

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.open(FRIENDS[index.current], '_blank', 'noopener,noreferrer');
    index.current = (index.current + 1) % FRIENDS.length;
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
      my <a
        href="#"
        onClick={handleClick}
        className="tooltip inline-link"
        data-tooltip="randomly selects a portfolio"
        style={{ color: 'inherit', textDecoration: 'none', borderBottom: '0.5px solid currentColor' }}
      >
        friends
      </a> also have websites
    </div>
  );
}
