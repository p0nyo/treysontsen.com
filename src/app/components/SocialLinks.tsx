'use client';

import { useState } from 'react';

const socials = [
  {
    label: "twitter", href: "https://x.com/98tsuj98", appHref: "twitter://user?screen_name=98tsuj98",
    iosStore: "https://apps.apple.com/app/x/id333903271",
    androidStore: "https://play.google.com/store/apps/details?id=com.twitter.android",
    symbol: "[x]", tooltip: "documenting things i build",
  },
  { label: "github", href: "https://github.com/p0nyo", appHref: null, iosStore: null, androidStore: null, symbol: "[gh]", tooltip: "projects and (private) notes" },
  {
    label: "linkedin", href: "https://www.linkedin.com/in/tsen", appHref: "linkedin://in/tsen",
    iosStore: "https://apps.apple.com/app/linkedin/id288429040",
    androidStore: "https://play.google.com/store/apps/details?id=com.linkedin.android",
    symbol: "[li]", tooltip: "semi-professional career profile",
  },
  {
    label: "instagram", href: "https://www.instagram.com/bigredtreyson/", appHref: "instagram://user?username=bigredtreyson",
    iosStore: "https://apps.apple.com/app/instagram/id389801252",
    androidStore: "https://play.google.com/store/apps/details?id=com.instagram.android",
    symbol: "[ig]", tooltip: "posting film of my friends/life",
  },
];

export default function SocialLinks() {
  const [pending, setPending] = useState<typeof socials[0] | null>(null);

  const handleClick = (e: React.MouseEvent, social: typeof socials[0]) => {
    if (window.innerWidth >= 768) return; // desktop: default behaviour
    if (!social.appHref) return; // no app to open in, skip prompt
    e.preventDefault();
    setPending(social);
  };

  const openInBrowser = () => {
    if (!pending) return;
    window.open(pending.href, '_blank', 'noopener,noreferrer');
    setPending(null);
  };

  const openInApp = () => {
    if (!pending?.appHref) return;
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    const storeUrl = isIOS ? pending.iosStore : isAndroid ? pending.androidStore : null;

    // use iframe so Safari fails silently instead of showing "invalid URL" error
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = pending.appHref;
    document.body.appendChild(iframe);
    setTimeout(() => { if (document.body.contains(iframe)) document.body.removeChild(iframe); }, 3000);

    if (storeUrl) {
      let elapsed = 0;
      let interval: ReturnType<typeof setInterval>;

      // tick elapsed only while page is visible — pauses if OS prompt is showing
      interval = setInterval(() => {
        if (!document.hidden) elapsed += 100;
        if (elapsed >= 1500) {
          clearInterval(interval);
          // only redirect if app didn't open (page never went hidden)
          if (!document.hidden) window.location.href = storeUrl;
        }
      }, 100);

      // if app opened, page goes hidden — cancel everything
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) clearInterval(interval);
      }, { once: true });
    }

    setPending(null);
  };

  return (
    <>
      <section style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link tooltip inline-link"
              data-tooltip={s.tooltip}
              onClick={(e) => handleClick(e, s)}
            >
              {s.symbol} {s.label}
            </a>
          ))}
        </div>
      </section>

      {pending && (
        <div
          onClick={() => setPending(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              background: '#111',
              borderTop: '0.5px solid rgba(232,232,224,0.15)',
              padding: '1.2rem 1.5rem 2rem',
              fontFamily: "'Menlo','Monaco','Courier New',monospace",
            }}
          >
            <p style={{ fontSize: '11px', color: '#555', margin: '0 0 1.2rem', letterSpacing: '0.05em' }}>
              where do you want to open this?
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setPending(null)}
                className="inline-link game-link"
                style={{ background: 'none', border: 'none', color: '#444', fontFamily: 'inherit', fontSize: '12px', cursor: 'pointer', padding: 0 }}
              >
                cancel
              </button>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <button
                  onClick={openInBrowser}
                  className="inline-link game-link"
                  style={{ background: 'none', border: 'none', color: '#888', fontFamily: 'inherit', fontSize: '12px', cursor: 'pointer', padding: 0, borderBottom: '0.5px solid #444' }}
                >
                  open in browser
                </button>
                {pending.appHref && (
                  <button
                    onClick={openInApp}
                    className="inline-link game-link"
                    style={{ background: 'none', border: 'none', color: '#e8e8e0', fontFamily: 'inherit', fontSize: '12px', cursor: 'pointer', padding: 0, borderBottom: '0.5px solid rgba(232,232,224,0.4)' }}
                  >
                    open in app
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
