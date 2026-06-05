import PortraitSection from "./components/PortraitSection";
import FriendLink from "./components/FriendLink";

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
        {/* Bio */}
        <section style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
          <p style={{ fontSize: "clamp(8px, 1.56vw, 11px)", lineHeight: "1.7", margin: 0, color: "#c8c8c0" }}>
            curr. software engineer @ visa, tech lead @ <a href="https://auec.club/" target="_blank" rel="noopener noreferrer" tabIndex={-1} className="tooltip" data-tooltip="auec club website" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '3px', userSelect: 'text', WebkitUserSelect: 'text' }}>auec</a> and building out a website for the <a href="https://www.instagram.com/_lovevisuals_/" target="_blank" rel="noopener noreferrer" tabIndex={-1} className="tooltip" data-tooltip="lovevisuals instagram portfolio" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '3px', userSelect: 'text', WebkitUserSelect: 'text' }}>lovevisuals</a> photography brand
          </p>
          <p style={{ fontSize: "clamp(8px, 1.56vw, 11px)", lineHeight: "1.7", margin: 0, color: "#c8c8c0" }}>
            spending most of my time building things that will hopefully make me rich enough to one day buy my life back; obsessed with productivity, systems and tracking anything that I can get my hands on
          </p>
          <p style={{ fontSize: "clamp(8px, 1.56vw, 11px)", lineHeight: "1.7", margin: 0, color: "#666660" }}>
            // prev. patty flipper @ mcdonalds and computer science major @ the university of auckland while working on many volunteer software projects for uni clubs and non-profits 
          </p>
          <p style={{ fontSize: "clamp(8px, 1.56vw, 11px)", lineHeight: "1.7", margin: 0, color: "#666660" }}>
            // usually playing <a href="https://jstris.jezevec10.com/u/ponyoponyo" target="_blank" rel="noopener noreferrer" tabIndex={-1} className="tooltip" data-tooltip="my jstris profile" style={{ color: 'inherit', textDecoration: 'underline', userSelect: 'text', WebkitUserSelect: 'text' }}>tetris</a> or piano in my free time and snowboarding the peaks in the south island during the winter<span className="cursor" />
          </p>
        </section>

        {/* Social links */}
        <section style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link tooltip"
                data-tooltip={s.tooltip}
              >
                {s.symbol} {s.label}
              </a>
            ))}
          </div>
        </section>
        </div>
      </div>
      <div style={{
        position: 'fixed',
        bottom: '1.2rem',
        left: '1.5rem',
        fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
        fontSize: 'clamp(8px, 1vw, 10px)',
        color: '#333',
        userSelect: 'none',
      }}>
        © {new Date().getFullYear()} treyson tsen, inspired by <a href="https://www.instagram.com/morilliu/" target="_blank" rel="noopener noreferrer" className="tooltip" data-tooltip="look at her terminal website reel" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '3px' }}>@morilliu</a>
      </div>
      <FriendLink />
    </main>
  );
}
