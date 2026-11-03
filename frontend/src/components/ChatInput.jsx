import { useEffect, useRef, useState } from "react";
import { SendIcon, StopIcon } from "./Icons";
import { MAX_QUESTION_LENGTH } from "../hooks/useChat";
import "./ChatInput.css";

export default function ChatInput({ onSend, onStop, isStreaming, candidateName }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  // Textarea apne aap lambi ho (max ~6 lines), phir scroll
  useEffect(() => {
    const el = textareaRef.current;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [text]);

  const canSend = text.trim().length > 0 && !isStreaming;

  const submit = () => {
    if (!canSend) return;
    onSend(text);
    setText("");
  };

  // Enter = send, Shift+Enter = nayi line
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  const nearLimit = text.length > MAX_QUESTION_LENGTH * 0.8;

  return (
    <div className="chat-input-wrap">
      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label htmlFor="chat-textarea" className="sr-only">
          Ask HiremeAI a question
        </label>
        <textarea
          id="chat-textarea"
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about skills, projects…"
          rows={1}
          maxLength={MAX_QUESTION_LENGTH}
          autoFocus
        />
        {isStreaming ? (
          // Answer aa raha ho tab Send ki jagah Stop
          <button type="button" className="send-btn stop" onClick={onStop} aria-label="Stop generating">
            <StopIcon size={14} />
          </button>
        ) : (
          <button type="submit" className="send-btn" disabled={!canSend} aria-label="Send message">
            <SendIcon size={18} />
          </button>
        )}
      </form>
      <div className="input-footer">
        <span>
          HiremeAI answers only from {candidateName ? `${candidateName.split(" ")[0]}'s` : "the candidate's"} resume
          and profile, and can make mistakes.
        </span>
        {nearLimit && (
          <span className="char-count">
            {text.length}/{MAX_QUESTION_LENGTH}
          </span>
        )}
      </div>
    </div>
  );
}
