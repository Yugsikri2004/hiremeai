import { useCallback, useRef, useState } from "react";
import { streamChat } from "../api/client";

// Chat ka saara "dimaag" yahan: messages, streaming, stop, retry, new chat.
// Components sirf dikhate hain, logic yahan -> code saaf rehta hai aur dobara use ho sakta hai.

export const MAX_QUESTION_LENGTH = 1000; // backend bhi limit check karta hai, ye user ko pehle hi rok deta hai
const HISTORY_LIMIT = 20; // backend ko sirf last 20 messages bhejte hain (tokens + speed)

let nextId = 1;
const makeId = () => `m${nextId++}`;

export function useChat() {
  // har message: { id, role: "user" | "assistant", content, done }
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null); // { message, question } -> question = retry ke liye
  const controllerRef = useRef(null); // Stop button ke liye: chal rahi request cancel karna

  // Last (assistant) message mein naya text jodna
  const appendToLast = (text) =>
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      updated[updated.length - 1] = { ...last, content: last.content + text };
      return updated;
    });

  // isRetry = fail hua sawaal dobara bhejna -> wo sawaal screen pe pehle se hai, dobara add nahi karna
  const send = useCallback(
    async (rawText, isRetry = false) => {
      const question = rawText.trim();
      if (!question || isStreaming) return;

      setError(null);

      // Retry pe last (fail hua) user message hata ke dobara jodte hain, taaki do baar na dikhe
      const base = isRetry ? messages.slice(0, -1) : messages;

      // Memory: purani baatein bhi backend ko jaati hain, warna "which one?" jaise sawaal AI nahi samjhega
      const history = base
        .filter((m) => m.content.trim())
        .map(({ role, content }) => ({ role, content }));
      const payload = [...history, { role: "user", content: question.slice(0, MAX_QUESTION_LENGTH) }].slice(-HISTORY_LIMIT);

      // Screen pe turant: user ka sawaal + khaali AI message (isme stream ka text bharta jaayega)
      setMessages((prev) => [
        ...(isRetry ? prev.slice(0, -1) : prev),
        { id: makeId(), role: "user", content: question, done: true },
        { id: makeId(), role: "assistant", content: "", done: false },
      ]);
      setIsStreaming(true);

      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        await streamChat(payload, { onChunk: appendToLast, signal: controller.signal });
      } catch (err) {
        if (err.name !== "AbortError") {
          // Fail hua -> user ka sawaal screen pe rehta hai, neeche error card + Retry
          // (khaali AI message neeche "finally" mein hat jaata hai)
          setError({ message: err.message, question });
        }
      } finally {
        // Stream khatam (ya Stop dabaya) -> message "done", Copy button + follow-ups dikh sakte hain
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role !== "assistant") return prev;
          // Stop jaldi dabaya aur ek bhi word nahi aaya -> khaali bubble mat chhodo
          if (!last.content) return prev.slice(0, -1);
          return [...prev.slice(0, -1), { ...last, done: true }];
        });
        setIsStreaming(false);
        controllerRef.current = null;
      }
    },
    [messages, isStreaming]
  );

  // Stop: jitna answer aa gaya wo rehta hai, aage ka band
  const stop = useCallback(() => controllerRef.current?.abort(), []);

  // New chat / Clear: sab saaf (chal rahi request bhi cancel)
  const reset = useCallback(() => {
    controllerRef.current?.abort();
    setMessages([]);
    setError(null);
  }, []);

  const retry = useCallback(() => {
    if (!error?.question) return;
    // Last message wahi fail hua sawaal hai? -> retry mode (dobara add nahi hoga)
    const last = messages[messages.length - 1];
    send(error.question, last?.role === "user" && last.content === error.question);
  }, [error, messages, send]);

  return { messages, isStreaming, error, send, stop, reset, retry, dismissError: () => setError(null) };
}
