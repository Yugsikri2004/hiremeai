import { useState } from "react";
import Avatar from "./Avatar";
import {
  BriefcaseIcon,
  CloseIcon,
  CodeIcon,
  DownloadIcon,
  EyeIcon,
  FolderIcon,
  GithubIcon,
  GradIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "./Icons";
import { resumeUrl } from "../api/client";
import "./Sidebar.css";

const TABS = [
  { id: "skills", label: "Skills", icon: CodeIcon },
  { id: "experience", label: "Experience", icon: BriefcaseIcon },
  { id: "projects", label: "Projects", icon: FolderIcon },
  { id: "contact", label: "Contact", icon: UserIcon },
];

// Resume se project ek lambi line mein aata hai: "Naam – description; technologies used: A, B"
// Isko tod ke naam, description aur tech list banate hain, taaki card mein saaf dikhe
function parseProject(text) {
  const [head, ...rest] = text.split(" – ");
  let body = rest.join(" – ");
  let tech = [];
  const match = body.match(/;?\s*technologies used:\s*(.*)$/i);
  if (match) {
    tech = match[1].split(",").map((t) => t.trim()).filter(Boolean);
    body = body.slice(0, match.index).trim();
  }
  if (!body) return { name: "", description: head, tech };
  return { name: head.trim(), description: body, tech };
}

function Chips({ items }) {
  return (
    <ul className="chips">
      {items.map((item) => (
        <li key={item} className="chip">
          {item}
        </li>
      ))}
    </ul>
  );
}

function ExperienceCard({ exp }) {
  // Description lamba hai -> pehle 3 lines, "Show more" se poora
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="card">
      <div className="card-title">{exp.role}</div>
      <div className="card-meta">
        {exp.company} · {exp.duration}
      </div>
      {exp.description && (
        <>
          <p className={`card-text ${expanded ? "" : "clamp"}`}>{exp.description}</p>
          <button className="link-btn" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
            {expanded ? "Show less" : "Show more"}
          </button>
        </>
      )}
      {exp.skills_used?.length > 0 && <Chips items={exp.skills_used} />}
    </article>
  );
}

function TabContent({ tab, profile }) {
  if (tab === "skills") {
    return profile.skills.length ? <Chips items={profile.skills} /> : <p className="muted">No skills listed.</p>;
  }

  if (tab === "experience") {
    return (
      <div className="stack">
        {profile.experiences.map((exp) => (
          <ExperienceCard key={`${exp.company}-${exp.duration}`} exp={exp} />
        ))}
        {profile.education.length > 0 && (
          <>
            <h3 className="section-label">
              <GradIcon size={14} /> Education
            </h3>
            {profile.education.map((edu) => (
              <article key={edu} className="card card-text">
                {edu}
              </article>
            ))}
          </>
        )}
      </div>
    );
  }

  if (tab === "projects") {
    return (
      <div className="stack">
        {profile.projects.map((raw) => {
          const p = parseProject(raw);
          return (
            <article key={raw} className="card">
              {p.name && <div className="card-title">{p.name}</div>}
              <p className="card-text">{p.description}</p>
              {p.tech.length > 0 && <Chips items={p.tech} />}
            </article>
          );
        })}
      </div>
    );
  }

  // Contact
  const { email, phone, linkedin, github } = profile.contact;
  return (
    <ul className="contact-list">
      {email && (
        <li>
          <a href={`mailto:${email}`}>
            <MailIcon /> {email}
          </a>
        </li>
      )}
      {phone && (
        <li>
          <a href={`tel:${phone.replace(/\s/g, "")}`}>
            <PhoneIcon /> {phone}
          </a>
        </li>
      )}
      {linkedin && (
        <li>
          <a href={linkedin} target="_blank" rel="noreferrer">
            <LinkedinIcon /> LinkedIn
          </a>
        </li>
      )}
      <li>
        {github ? (
          <a href={github} target="_blank" rel="noreferrer">
            <GithubIcon /> GitHub
          </a>
        ) : (
          <span className="contact-disabled">
            <GithubIcon /> GitHub · coming soon
          </span>
        )}
      </li>
    </ul>
  );
}

// Left panel: profile card + resume buttons + tabs. Mobile pe ye drawer ban jaata hai (open/onClose).
export default function Sidebar({ profile, status, profileError, onRetryProfile, onViewResume, open, onClose }) {
  const [tab, setTab] = useState("skills");

  return (
    <aside className={`sidebar ${open ? "open" : ""}`} aria-label="Candidate profile">
      <button className="btn btn-ghost icon-btn sidebar-close" onClick={onClose} aria-label="Close profile">
        <CloseIcon />
      </button>

      <div className="profile-card">
        <Avatar name={profile?.name} size={64} />
        <div className="profile-name">{profile?.name || (status === "loading" ? "Loading…" : "HiremeAI")}</div>
        {profile?.headline && <div className="profile-headline">{profile.headline}</div>}
        {profile?.location && (
          <div className="profile-location">
            <MapPinIcon size={14} /> {profile.location}
          </div>
        )}
        <div className="profile-actions">
          <button className="btn" onClick={onViewResume} disabled={status !== "online"}>
            <EyeIcon size={16} /> View Resume
          </button>
          <a className={`btn btn-primary ${status !== "online" ? "is-disabled" : ""}`} href={resumeUrl(true)} download>
            <DownloadIcon size={16} /> Download
          </a>
        </div>
      </div>

      {/* Tabs (role="tablist" -> screen reader ko pata chale ye tabs hain) */}
      <div className="tabs" role="tablist" aria-label="Profile sections">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            className={`tab ${tab === id ? "active" : ""}`}
            onClick={() => setTab(id)}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="tab-panel" role="tabpanel">
        {profile ? (
          <TabContent tab={tab} profile={profile} />
        ) : status === "loading" ? (
          <div className="skeleton-list" aria-label="Loading profile">
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton short" />
          </div>
        ) : (
          <div className="sidebar-error">
            <p>{profileError || "Profile could not be loaded."}</p>
            <button className="btn" onClick={onRetryProfile}>
              Try again
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
