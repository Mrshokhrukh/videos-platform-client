
import { useState } from "react";

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

const colors = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
];

export default function Avatar({ src, name = "", size = "md" }) {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-20 w-20 text-xl",
  };

  const colorIndex =
    [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    colors.length;

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold ${
        sizes[size] || sizes.md
      } ${colors[colorIndex]}`}
      role="img"
      aria-label={name || "Foydalanuvchi"}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        getInitials(name) || "?"
      )}
    </div>
  );
}
