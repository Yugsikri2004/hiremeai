import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import { AlertIcon, RefreshIcon } from "./Icons";
import { FOLLOW_UP_POOL } from "../data/questions";
import "./MessageList.css";

function pickFollowUps(messages) {
  const asked = new Set(messages.filter((m) => m.role === "user").map((m) => m.content.trim().toLowerCase()));
  return FOLLOW_UP_POOL.filter((q) => !asked.has(q.toLowerCase())).slice(0, 3);
}

export default function MessageList({ messages, isStreaming, error, onAsk, onRetry, onDismissError }) {
  const scrollRef = useRef(null);
  const stickToBottom = useRef(true); // user upar scroll karke padh raha ho toh zabardasti neeche mat le jao

  const onScroll = () => {
    const el = scrollRef.current;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  // Auto-scroll: naya message / naya chunk aaya -> neeche jao (agar user neeche hi tha)
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages, error]);

  // Naya sawaal bheja -> hamesha neeche
  const userCount = messages.filter((m) => m.role === "user").length;
  useEffect(() => {
    stickToBottom.current = true;
  }, [userCount]);

  const last = messages[messages.length - 1];
  const showFollowUps = !isStreaming && !error && last?.role === "assistant" && last.done;

  return (
    // role="log" -> screen reader ko pata chale ye chat history hai
    <div className="message-scroll" ref={scrollRef} onScroll={onScroll} role="log" aria-label="Conversation">
      <div className="message-list">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}

        {error && (
          <div className="error-card" role="alert">
            <AlertIcon size={18} />
            <div className="error-text">{error.message}</div>
            <button className="btn" onClick={onRetry}>
              <RefreshIcon size={15} /> Retry
            </button>
            <button className="btn btn-ghost" onClick={onDismissError}>
              Dismiss
            </button>
          </div>
        )}

        {showFollowUps && (
          <div className="follow-ups" aria-label="Suggested follow-up questions">
            {pickFollowUps(messages).map((q) => (
              <button key={q} className="follow-up" onClick={() => onAsk(q)}>
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
