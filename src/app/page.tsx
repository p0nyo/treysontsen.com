import PortraitSection from "./components/PortraitSection";
import FriendLink from "./components/FriendLink";
import BioSection from "./components/BioSection";
import SocialLinks from "./components/SocialLinks";

const ASCII_TREYSON = ` _________  ________  _______       ___    ___ ________  ________  ________
|\\___   ___\\\\   __  \\|\\  ___ \\     |\\  \\  /  /|\\   ____\\|\\   __  \\|\\   ___  \\
\\|___ \\  \\_\\ \\  \\|\\  \\ \\   __/|    \\ \\  \\/  / | \\  \\___|\\ \\  \\|\\  \\ \\  \\\\ \\  \\
     \\ \\  \\ \\ \\   _  _\\ \\  \\_|/__   \\ \\    / / \\ \\_____  \\ \\  \\\\\\  \\ \\  \\\\ \\  \\
      \\ \\  \\ \\ \\  \\\\  \\\\ \\  \\_|\\ \\   \\/  /  /   \\|____|\\  \\ \\  \\\\\\  \\ \\  \\\\ \\  \\
       \\ \\__\\ \\ \\__\\\\ _\\\\ \\_______\\__/  / /       ____\\_\\  \\ \\_______\\ \\__\\\\ \\__\\
        \\|__|  \\|__|\\|__|\\|_______|\\___/ /       |\\_________\\|_______|\\|__| \\|__|
                                  \\|___|/        \\|_________|`;

const ASCII_TSEN = ` _________  ________  _______   ________
|\\___   ___\\\\   ____\\|\\  ___ \\ |\\   ___  \\
\\|___ \\  \\_\\ \\  \\___|\\ \\   __/|\\ \\  \\\\ \\  \\
     \\ \\  \\ \\ \\_____  \\ \\  \\_|/_\\ \\  \\\\ \\  \\
      \\ \\  \\ \\|____|\\  \\ \\  \\_|\\ \\ \\  \\\\ \\  \\
       \\ \\__\\  ____\\_\\  \\ \\_______\\ \\__\\\\ \\__\\
        \\|__| |\\_________\\|_______|\\|__| \\|__|
              \\|_________|`;


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
        <div className="ascii-name" style={{ display: "flex", alignItems: "flex-start", overflowX: "visible" }}>{
          }<pre style={{ fontSize: "clamp(1px, 1.1vw, 8px)", lineHeight: "1.3", margin: 0, color: "#e8e8e0", whiteSpace: "pre" }}>{ASCII_TREYSON}</pre>{
          }<pre style={{ fontSize: "clamp(1px, 0.65vw, 5px)", lineHeight: "1.3", margin: 0, marginLeft: "-1.2rem", color: "#e8e8e0", whiteSpace: "pre" }}>{ASCII_TSEN}</pre>
        </div>

        {/* Bio, currently, links — capped to name width */}
        <div style={{ maxWidth: "clamp(0px, 72vw, 560px)" }}>
        <BioSection />

        <SocialLinks />
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
