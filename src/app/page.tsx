import PortraitSection from "./components/PortraitSection";

const ASCII_NAME = `   __                                      __
  / /_________  __  ___________  ____     / /_________  ____
 / __/ ___/ _ \\/ / / / ___/ __ \\/ __ \\   / __/ ___/ _ \\/ __ \\
/ /_/ /  /  __/ /_/ (__  ) /_/ / / / /  / /_(__  )  __/ / / /
\\__/_/   \\___/\\__, /____/\\____/_/ /_/   \\__/____/\\___/_/ /_/
             /____/`;

const socials = [
  { label: "github", href: "https://github.com/p0nyo", symbol: "[gh]" },
  { label: "instagram", href: "https://www.instagram.com/tsennpai/", symbol: "[ig]" },
  { label: "linkedin", href: "https://www.linkedin.com/in/tsen", symbol: "[li]" },
];

export default function Home() {
  return (
    <main
      className="flex flex-col md:flex-row items-center md:items-center justify-center min-h-screen gap-8 md:gap-12 p-8"
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
          style={{
            fontSize: "clamp(5px, 1.8vw, 11px)",
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
        <section style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
          <p style={{ fontSize: "clamp(8px, 2vw, 13px)", lineHeight: "1.7", margin: 0, color: "#c8c8c0" }}>
            {'>'} swe @ visa based in auckland, nz. previously a computer science major from the university of auckland while working the grills at mcdonalds. spending most of my time building things that can hopefully make me rich. obsessed with productivity, systems and tracking everything that i can. i enjoy snowboarding and playing tetris too #jirahater
          </p>
        </section>

        {/* Currently working on */}
        <section style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
          <p style={{ fontSize: "clamp(8px, 2vw, 13px)", lineHeight: "1.7", margin: 0, color: "#c8c8c0" }}>
            {'>'} currently a tech lead for a university esports club and building out a website for a photography brand<span className="cursor" />
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
                className="social-link"
              >
                {s.symbol} {s.label}
              </a>
            ))}
          </div>
        </section>
        </div>
      </div>
    </main>
  );
}
