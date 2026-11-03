import { useEffect, useRef } from "react";
import { CloseIcon, DownloadIcon, ExternalIcon } from "./Icons";
import { resumeUrl } from "../api/client";
import "./ResumeModal.css";

// Resume preview popup: PDF browser ke andar (iframe), saath mein Download + New tab
export default function ResumeModal({ open, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus(); // keyboard users ke liye focus seedha popup pe
    const onKey = (e) => e.key === "Escape" && onClose(); // Esc se band
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    // Bahar (dark area) click -> band; andar click -> band nahi (stopPropagation)
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Resume preview" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Resume</span>
          <div className="modal-actions">
            {/* Kuch phones iframe mein PDF nahi dikhate -> "Open" se naye tab mein */}
            <a className="btn" href={resumeUrl(false)} target="_blank" rel="noreferrer">
              <ExternalIcon size={15} /> <span className="btn-label">Open</span>
            </a>
            <a className="btn btn-primary" href={resumeUrl(true)} download>
              <DownloadIcon size={15} /> <span className="btn-label">Download</span>
            </a>
            <button ref={closeRef} className="btn btn-ghost icon-btn" onClick={onClose} aria-label="Close resume preview">
              <CloseIcon />
            </button>
          </div>
        </div>
        <iframe className="modal-frame" src={resumeUrl(false)} title="Resume PDF" />
      </div>
    </div>
  );
}
