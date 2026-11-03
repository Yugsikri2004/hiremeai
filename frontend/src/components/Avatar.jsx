// Profile photo ki jagah initials ("YS"). Photo lagani ho toh: frontend/public/avatar.jpg rakho
// aur neeche PHOTO_URL = "/avatar.jpg" kar do.
const PHOTO_URL = null;

function initials(name) {
  if (!name) return "AI";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function Avatar({ name, size = 40 }) {
  const style = { width: size, height: size, fontSize: size * 0.38 };
  if (PHOTO_URL) {
    return <img className="avatar" src={PHOTO_URL} alt={name || "Profile photo"} style={style} />;
  }
  return (
    <div className="avatar" style={style} role="img" aria-label={name || "Profile"}>
      {initials(name)}
    </div>
  );
}
