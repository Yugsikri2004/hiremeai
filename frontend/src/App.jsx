import { useCallback, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import WelcomeScreen from "./components/WelcomeScreen";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import ResumeModal from "./components/ResumeModal";
import { useProfile } from "./hooks/useProfile";
import { useChat } from "./hooks/useChat";
import "./App.css";

// Poori app ka layout: left = profile sidebar, right = chat (header + messages + input)
// Data aur logic hooks mein hai (useProfile, useChat), yahan sirf pieces jodte hain
export default function App() {
  const { profile, status, error: profileError, retry: retryProfile } = useProfile();
  const chat = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false); // sirf mobile drawer ke liye
  const [resumeOpen, setResumeOpen] = useState(false);

  const closeResume = useCallback(() => setResumeOpen(false), []);
  const openResume = () => {
    setSidebarOpen(false);
    setResumeOpen(true);
  };

  // Suggestion / follow-up click -> seedha sawaal bhej do; mobile pe drawer band
  const ask = (text) => {
    setSidebarOpen(false);
    chat.send(text);
  };

  const isEmpty = chat.messages.length === 0 && !chat.error;

  return (
    <div className="app">
      <Sidebar
        profile={profile}
        status={status}
        profileError={profileError}
        onRetryProfile={retryProfile}
        onViewResume={openResume}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {/* Mobile: drawer khula ho toh peeche dark overlay, click se band */}
      {sidebarOpen && <div className="drawer-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="chat-panel">
        <ChatHeader
          profile={profile}
          status={status}
          onOpenProfile={() => setSidebarOpen(true)}
          onViewResume={openResume}
          onNewChat={chat.reset}
          canReset={!isEmpty}
        />

        {status === "offline" && (
          <div className="offline-banner" role="status">
            {profileError} <button className="link-btn" onClick={retryProfile}>Retry</button>
          </div>
        )}

        {isEmpty ? (
          <div className="message-scroll">
            <div className="message-list">
              <WelcomeScreen profile={profile} onAsk={ask} disabled={chat.isStreaming} />
            </div>
          </div>
        ) : (
          <MessageList
            messages={chat.messages}
            isStreaming={chat.isStreaming}
            error={chat.error}
            onAsk={ask}
            onRetry={chat.retry}
            onDismissError={chat.dismissError}
          />
        )}

        <ChatInput
          onSend={chat.send}
          onStop={chat.stop}
          isStreaming={chat.isStreaming}
          candidateName={profile?.name}
        />
      </main>

      <ResumeModal open={resumeOpen} onClose={closeResume} />
    </div>
  );
}
