import { useCallback, useEffect, useState } from "react";
import { fetchProfile } from "../api/client";

// Profile load karna + status batana (header ka "AI Assistant Online" isi se aata hai)
// status: "loading" -> "online" (backend ne jawab diya) ya "offline" (backend tak nahi pahunche)
export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("loading"); // shuru mein hi "loading", alag se set karne ki zaroorat nahi
  const [error, setError] = useState(null);

  const load = useCallback((signal) => {
    fetchProfile(signal)
      .then((data) => {
        setProfile(data);
        setStatus("online");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setStatus("offline");
      });
  }, []);

  useEffect(() => {
    // Page band / component hata toh adhoori request cancel (memory leak nahi)
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  // Retry button: status wapas "loading" (Connecting…) aur dobara try
  const retry = () => {
    setStatus("loading");
    setError(null);
    load();
  };

  return { profile, status, error, retry };
}
