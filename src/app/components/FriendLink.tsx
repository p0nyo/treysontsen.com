'use client';

const FRIENDS = [
  'https://www.watshisname-stuutzer.com/',
  'https://blackpri0r.dev/',
];

export default function FriendLink() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const url = FRIENDS[Math.floor(Math.random() * FRIENDS.length)];
    window.open(url, '_blank', 'noopener,noreferrer');
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
        className="tooltip"
        data-tooltip="click for a portfolio, randomly selected"
        style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '3px' }}
      >
        friends
      </a> also have websites
    </div>
  );
}
