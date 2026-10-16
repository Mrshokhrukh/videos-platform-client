
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchInput({
  value = "",
  onChange,
  placeholder = "Qidirish...",
  onSearch,
}) {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (text === value) return;

    const timer = setTimeout(() => {
      onChange?.(text);
    }, 300);

    return () => clearTimeout(timer);
  }, [text, value, onChange]);

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setText("");
      onChange?.("");
    }

    if (event.key === "Enter") {
      onSearch?.(text);
    }
  }

  return (
    <div className="flex h-10 w-full items-center gap-2 rounded-lg border bg-white px-3 focus-within:ring-2 focus-within:ring-blue-500">
      <Search size={18} className="shrink-0 text-gray-400" />

      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        aria-label={placeholder}
      />

      {text && (
        <button
          type="button"
          onClick={() => {
            setText("");
            onChange?.("");
          }}
          aria-label="Qidiruvni tozalash"
          className="text-gray-400 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
