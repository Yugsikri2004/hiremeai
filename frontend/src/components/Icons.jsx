// Saare icons yahan: chhote SVG, koi extra library install nahi karni padi (app halki rehti hai)
// Har icon "currentColor" use karta hai -> jis text color mein rakho, wahi rang le leta hai

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

// Har icon isi wrapper mein apne paths daalta hai (size prop se chhota/bada)
function Svg({ size = 18, children, ...props }) {
  return (
    <svg {...base} width={size} height={size} {...props}>
      {children}
    </svg>
  );
}

export function SendIcon(props) {
  return <Svg {...props}><><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></></Svg>;
}
export function StopIcon(props) {
  return <Svg {...props}><rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" stroke="none" /></Svg>;
}
export function PlusIcon(props) {
  return <Svg {...props}><><path d="M12 5v14" /><path d="M5 12h14" /></></Svg>;
}
export function EyeIcon(props) {
  return <Svg {...props}><><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></></Svg>;
}
export function DownloadIcon(props) {
  return <Svg {...props}><><path d="M12 4v11" /><path d="m7 10 5 5 5-5" /><path d="M5 20h14" /></></Svg>;
}
export function CopyIcon(props) {
  return <Svg {...props}><><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></></Svg>;
}
export function CheckIcon(props) {
  return <Svg {...props}><path d="m5 12 5 5 9-10" /></Svg>;
}
export function MailIcon(props) {
  return <Svg {...props}><><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></></Svg>;
}
export function PhoneIcon(props) {
  return <Svg {...props}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></Svg>;
}
export function LinkedinIcon(props) {
  return <Svg {...props}><><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7" /><path d="M8 7v.01" /><path d="M12 17v-4a2 2 0 0 1 4 0v4" /><path d="M12 10v7" /></></Svg>;
}
export function GithubIcon(props) {
  return <Svg {...props}><path d="M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></Svg>;
}
export function MapPinIcon(props) {
  return <Svg {...props}><><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" /><circle cx="12" cy="9" r="2.5" /></></Svg>;
}
export function CloseIcon(props) {
  return <Svg {...props}><><path d="M6 6l12 12" /><path d="M18 6 6 18" /></></Svg>;
}
export function PanelIcon(props) {
  return <Svg {...props}><><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></></Svg>;
}
export function RefreshIcon(props) {
  return <Svg {...props}><><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 4v7h-7" /></></Svg>;
}
export function UserIcon(props) {
  return <Svg {...props}><><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></></Svg>;
}
export function CodeIcon(props) {
  return <Svg {...props}><><path d="m8 7-5 5 5 5" /><path d="m16 7 5 5-5 5" /></></Svg>;
}
export function BriefcaseIcon(props) {
  return <Svg {...props}><><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M3 13h18" /></></Svg>;
}
export function FolderIcon(props) {
  return <Svg {...props}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></Svg>;
}
export function ApiIcon(props) {
  return <Svg {...props}><><path d="M4 12h4" /><path d="M16 12h4" /><circle cx="12" cy="12" r="4" /><path d="M12 4v4" /><path d="M12 16v4" /></></Svg>;
}
export function ToolIcon(props) {
  return <Svg {...props}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4Z" /></Svg>;
}
export function StarIcon(props) {
  return <Svg {...props}><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" /></Svg>;
}
export function AlertIcon(props) {
  return <Svg {...props}><><circle cx="12" cy="12" r="9" /><path d="M12 8v5" /><path d="M12 16v.01" /></></Svg>;
}
export function ExternalIcon(props) {
  return <Svg {...props}><><path d="M14 4h6v6" /><path d="M20 4 11 13" /><path d="M19 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" /></></Svg>;
}
export function TargetIcon(props) {
  return <Svg {...props}><><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" fill="currentColor" /></></Svg>;
}
export function GradIcon(props) {
  return <Svg {...props}><><path d="m2 9 10-5 10 5-10 5Z" /><path d="M6 11v5c3 2 9 2 12 0v-5" /></></Svg>;
}

// HiremeAI ka logo: gradient square ke andar chat bubble + sparkle
export function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="hm-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B9BFF" />
          <stop offset="1" stopColor="#5B6CF0" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#hm-grad)" />
      <path d="M9 11.5A3.5 3.5 0 0 1 12.5 8h7A3.5 3.5 0 0 1 23 11.5v5a3.5 3.5 0 0 1-3.5 3.5H15l-4 3.5V20a3.5 3.5 0 0 1-2-3.2Z" fill="#fff" fillOpacity="0.95" />
      <path d="m16 10.6.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9Z" fill="#5B6CF0" />
    </svg>
  );
}
