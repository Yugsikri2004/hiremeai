import Avatar from "./Avatar";
import { LogoMark, TargetIcon } from "./Icons";
import { SUGGESTIONS } from "../data/questions";
import "./WelcomeScreen.css";

// Khaali chat pe dikhta hai: welcome + candidate ka intro + suggestion cards
export default function WelcomeScreen({ profile, onAsk, onMatchJob, disabled, online }) {
  const firstName = profile?.name?.split(" ")[0];
  const owner = firstName ? `${firstName}'s` : "the candidate's";

  return (
    <section className="welcome">
      <div className="welcome-hero">
        <div className="welcome-logo">
          <LogoMark size={52} />
        </div>
        <h1>Hi, I'm HiremeAI 👋</h1>
        <p className="welcome-sub">Your personal AI guide to {owner} professional journey.</p>
        <p className="welcome-hint">Ask me anything about the experience, skills, projects, and career.</p>
      </div>

      {/* Intro card: data backend (/profile) se, koi hard-coded fake info nahi */}
      {profile && (
        <div className="intro-card">
          <Avatar name={profile.name} size={44} />
          <div>
            <div className="intro-name">{profile.name}</div>
            {profile.headline && <div className="intro-headline">{profile.headline}</div>}
            {profile.summary && <p className="intro-summary">{profile.summary}</p>}
          </div>
        </div>
      )}

      {/* JD Matcher ka bada button: HR ke liye sabse kaam ka feature, isliye welcome pe hi */}
      <button className="jd-cta" onClick={onMatchJob} disabled={!online}>
        <span className="suggestion-icon">
          <TargetIcon size={16} />
        </span>
        <span>
          <span className="jd-cta-title">Hiring for a role?</span>
          <span className="jd-cta-sub">Paste the job description and see how {firstName || "the candidate"} matches.</span>
        </span>
      </button>

      <div className="suggestions-title">Try asking</div>
      <div className="suggestion-grid">
        {SUGGESTIONS.map(({ icon: Icon, text }, i) => (
          <button
            key={text}
            className="suggestion-card"
            onClick={() => onAsk(text)}
            disabled={disabled}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <span className="suggestion-icon">
              <Icon size={16} />
            </span>
            {text}
          </button>
        ))}
      </div>
    </section>
  );
}
