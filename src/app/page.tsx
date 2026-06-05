import PortraitSection from "./components/PortraitSection";
import FriendLink from "./components/FriendLink";
import BioSection from "./components/BioSection";

const ASCII_NAME = `   __                                      __
  / /_________  __  ___________  ____     / /_________  ____
 / __/ ___/ _ \\/ / / / ___/ __ \\/ __ \\   / __/ ___/ _ \\/ __ \\
/ /_/ /  /  __/ /_/ (__  ) /_/ / / / /  / /_(__  )  __/ / / /
\\__/_/   \\___/\\__, /____/\\____/_/ /_/   \\__/____/\\___/_/ /_/
             /____/`;

const socials = [
  { label: "twitter", href: "https://x.com/98tsuj98", symbol: "[x]", tooltip: "documenting things i build" },
  { label: "github", href: "https://github.com/p0nyo", symbol: "[gh]", tooltip: "projects and (private) notes" },
  { label: "linkedin", href: "https://www.linkedin.com/in/tsen", symbol: "[li]", tooltip: "semi-professional career profile" },
  { label: "instagram", href: "https://www.instagram.com/tsennpai/", symbol: "[ig]", tooltip: "my main account" },
];

export default function Home() {
  return (
    <main
      className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-8 py-4"
      style={{
        fontFamily: "'Menlo', 'Monaco', 'Courier New', Courier, monospace",
        background: "#0a0a0a",
        color: "#e8e8e0",
      }}
    >
      <PortraitSection />

      {/* Bottom on mobile, right on desktop — info */}
      <div
        style={{
          flex: "1 1 0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: "2rem",
          maxWidth: "560px",
          width: "100%",
        }}
      >
        {/* Name in ASCII */}
        <pre
          className="ascii-name"
          style={{
            fontSize: "clamp(1px, 2.5vw, 15px)",
            lineHeight: "1.3",
            margin: 0,
            color: "#e8e8e0",
            whiteSpace: "pre",
            overflowX: "auto",
          }}
        >
          {ASCII_NAME}
        </pre>

        {/* Bio, currently, links — capped to name width */}
        <div style={{ maxWidth: "clamp(0px, 72vw, 560px)" }}>
        <BioSection />

        {/* Social links */}
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
              >
                {s.symbol} {s.label}
              </a>
            ))}
          </div>
        </section>
        </div>
      </div>
      <div className="widget" style={{
        position: 'fixed',
        bottom: '1.2rem',
        left: '1.5rem',
        fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
        fontSize: 'clamp(8px, 1vw, 10px)',
        color: '#333',
        userSelect: 'none',
      }}>
        © {new Date().getFullYear()} treyson tsen, inspired by <a href="https://www.instagram.com/morilliu/" target="_blank" rel="noopener noreferrer" className="tooltip inline-link" data-tooltip="look at her terminal website reel" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '0.5px solid currentColor' }}>@morilliu</a>
      </div>
      <FriendLink />
    </main>
  );
}
