// Suggested + follow-up questions ek jagah (alag file -> React ka hot reload sahi chalta hai,
// aur sawaal badalne ho toh sirf yahan badlo)
import { ApiIcon, BriefcaseIcon, CodeIcon, FolderIcon, StarIcon, ToolIcon, UserIcon } from "../components/Icons";

// Brief wale 7 suggested questions (welcome screen ke cards)
export const SUGGESTIONS = [
  { icon: UserIcon, text: "Tell me about yourself." },
  { icon: CodeIcon, text: "What are your technical skills?" },
  { icon: BriefcaseIcon, text: "Tell me about your professional experience." },
  { icon: FolderIcon, text: "What projects have you worked on?" },
  { icon: ApiIcon, text: "What is your experience with API testing?" },
  { icon: ToolIcon, text: "What automation tools do you know?" },
  { icon: StarIcon, text: "Why should we hire you?" },
];

// Answer ke baad dikhne wale follow-ups: upar ke 7 + kuch extra (jo pooch chuke wo nahi dikhte)
export const FOLLOW_UP_POOL = [
  ...SUGGESTIONS.map((s) => s.text),
  "What was your most challenging project?",
  "When can you join?",
  "What are your career goals?",
  "What are you currently learning?",
  "How can I contact you?",
];
