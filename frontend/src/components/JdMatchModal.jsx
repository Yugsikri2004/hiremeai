import { useEffect, useRef, useState } from "react";
import { CloseIcon, TargetIcon } from "./Icons";
import { matchJob } from "../api/client";
import "./ResumeModal.css"; // backdrop + modal ka base style wahi se
import "./JdMatchModal.css";

// JD Matcher popup: HR job description paste kare -> score + kaunsi skills match/learning/missing
// Sab data backend (/match) se; frontend mein koi fake score nahi banta

const MIN_LENGTH = 50; // backend bhi yahi check karta hai, yahan pehle hi bata dete hain
const MAX_LENGTH = 8000;

// Score ke hisaab se rang: 75+ hara, 50+ peela, baaki laal
const scoreTone = (score) => (score >= 75 ? "good" : score >= 50 ? "ok" : "low");

function SkillGroup({ title, skills, tone }) {
  if (!skills?.length) return null;
  return (
    <div className="jd-group">
      <div className="jd-group-title">{title}</div>
      <div className="jd-chips">
        {skills.map((s) => (
          <span key={s} className={`jd-chip jd-chip-${tone}`}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function JdMatchModal({ open, onClose, candidateName }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    textareaRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose(); // Esc se band
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      controllerRef.current?.abort(); // popup band -> chal rahi request bhi cancel
    };
  }, [open, onClose]);

  if (!open) return null;

  const trimmed = text.trim();
  const tooShort = trimmed.length < MIN_LENGTH;
  const name = candidateName?.split(" ")[0] || "the candidate";

  const analyse = async (e) => {
    e.preventDefault();
    if (tooShort || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const controller = new AbortController();
    controllerRef.current = controller;
    try {
      setResult(await matchJob(trimmed, controller.signal));
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setText("");
    textareaRef.current?.focus();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal jd-modal" role="dialog" aria-modal="true" aria-label="Job description match" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">
            <TargetIcon size={17} /> Match a job description
          </span>
          <button className="btn btn-ghost icon-btn" onClick={onClose} aria-label="Close job match">
            <CloseIcon />
          </button>
        </div>

        <div className="jd-body">
          {!result ? (
            <form onSubmit={analyse} className="jd-form">
              <p className="jd-hint">Paste a job description to see how well {name}'s experience fits the role.</p>
              <textarea
                ref={textareaRef}
                className="jd-input"
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
                placeholder="Paste the job description here…"
                disabled={loading}
              />
              <div className="jd-form-footer">
                <span className="jd-count">
                  {tooShort && trimmed.length > 0 ? `At least ${MIN_LENGTH} characters` : `${text.length} / ${MAX_LENGTH}`}
                </span>
                <button type="submit" className="btn btn-primary" disabled={tooShort || loading}>
                  {loading ? "Analysing…" : "Analyse match"}
                </button>
              </div>
              {error && (
                <div className="jd-error" role="alert">
                  {error}
                </div>
              )}
            </form>
          ) : (
            <div className="jd-result" aria-live="polite">
              <div className="jd-score-row">
                <div className={`jd-score jd-score-${scoreTone(result.match_score)}`} aria-label={`Match score ${result.match_score} out of 100`}>
                  {result.match_score}
                  <span>/100</span>
                </div>
                <div>
                  <div className="jd-verdict">{result.verdict}</div>
                  <p className="jd-summary">{result.summary}</p>
                </div>
              </div>

              <SkillGroup title="Matching skills" skills={result.matching_skills} tone="good" />
              <SkillGroup title="Currently learning" skills={result.learning_skills} tone="ok" />
              <SkillGroup title="Not in profile" skills={result.missing_skills} tone="low" />

              <p className="jd-disclaimer">AI estimate based only on {name}'s resume and profile. Please verify in an interview.</p>
              <div className="jd-form-footer">
                <span />
                <button className="btn" onClick={reset}>
                  Try another job
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
