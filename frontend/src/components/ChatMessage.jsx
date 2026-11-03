import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { CheckIcon, CopyIcon, LogoMark } from "./Icons";
import "./ChatMessage.css";

// AI ke links naye tab mein khulein (recruiter ki chat band na ho)
const markdownComponents = {
  a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
};

// AI soch raha hai (pehla word aane se pehle) -> 3 hilte dots
function TypingIndicator() {
  return (
    <div className="typing" aria-label="HiremeAI is typing">
      <span />
      <span />
      <span />
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard permission nahi mili -> chup-chaap ignore, app crash nahi honi chahiye
    }
  };
  return (
    <button className="msg-action" onClick={copy} aria-label="Copy response">
      {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function ChatMessage({ message }) {
  if (message.role === "user") {
    return (
      <div className="msg msg-user">
        <div className="bubble">{message.content}</div>
      </div>
    );
  }

  const thinking = !message.done && !message.content;
  return (
    <div className="msg msg-ai">
      <div className="msg-avatar">
        <LogoMark size={28} />
      </div>
      <div className="msg-body">
        <div className="msg-author">HiremeAI</div>
        {thinking ? (
          <TypingIndicator />
        ) : (
          // skipHtml -> AI ke answer mein HTML aaye toh render nahi hoga (safety)
          <div className={`markdown ${!message.done ? "streaming" : ""}`}>
            <ReactMarkdown skipHtml components={markdownComponents}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        {message.done && message.content && (
          <div className="msg-actions">
            <CopyButton text={message.content} />
          </div>
        )}
      </div>
    </div>
  );
}
