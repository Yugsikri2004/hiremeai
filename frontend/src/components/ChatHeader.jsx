import Avatar from "./Avatar";
import { DownloadIcon, EyeIcon, LogoMark, PlusIcon, TargetIcon } from "./Icons";
import { resumeUrl } from "../api/client";
import "./ChatHeader.css";

// Status ke hisaab se text + rang (backend chal raha hai ya nahi)
const STATUS = {
  loading: { label: "Connecting…", className: "status-loading" },
  online: { label: "AI Assistant Online", className: "status-online" },
  offline: { label: "Offline", className: "status-offline" },
};

export default function ChatHeader({ profile, status, onOpenProfile, onViewResume, onMatchJob, onNewChat, canReset }) {
  const s = STATUS[status];
  return (
    <header className="chat-header">
      <div className="brand">
        {/* Mobile pe sidebar chhupa hota hai -> avatar dabao toh profile drawer khulega */}
        <button className="profile-toggle" onClick={onOpenProfile} aria-label="Open candidate profile">
          <Avatar name={profile?.name} size={34} />
        </button>
        <LogoMark size={30} />
        <div className="brand-text">
          <span className="brand-name">HiremeAI</span>
          <span className="brand-tagline">Your career, one conversation away.</span>
        </div>
      </div>

      <div className="header-actions">
        {/* aria-live -> status badle toh screen reader bolega */}
        <span className={`status-pill ${s.className}`} aria-live="polite">
          <span className="status-dot" />
          <span className="status-label">{s.label}</span>
        </span>
        {/* Mobile pe sirf icon dikhta hai (btn-label chhup jaata hai), isliye aria-label */}
        <button className="btn compact-md" onClick={onMatchJob} disabled={status !== "online"} aria-label="Match a job description" title="Match a job description">
          <TargetIcon size={16} /> <span className="btn-label">Match JD</span>
        </button>
        <button className="btn hide-sm" onClick={onViewResume} disabled={status !== "online"}>
          <EyeIcon size={16} /> <span className="btn-label">View Resume</span>
        </button>
        <a
          className={`btn hide-sm compact-md ${status !== "online" ? "is-disabled" : ""}`}
          href={resumeUrl(true)}
          download
          aria-label="Download resume"
        >
          <DownloadIcon size={16} /> <span className="btn-label">Download</span>
        </a>
        <button className="btn btn-primary" onClick={onNewChat} disabled={!canReset} title="Clear conversation">
          <PlusIcon size={16} /> <span className="btn-label">New chat</span>
        </button>
      </div>
    </header>
  );
}
