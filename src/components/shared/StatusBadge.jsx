
const statuses = {
  active: {
    label: "Aktiv",
    color: "bg-green-100 text-green-700",
  },
  blocked: {
    label: "Bloklangan",
    color: "bg-red-100 text-red-700",
  },
  published: {
    label: "Nashr qilingan",
    color: "bg-blue-100 text-blue-700",
  },
  draft: {
    label: "Qoralama",
    color: "bg-gray-100 text-gray-700",
  },
};

export default function StatusBadge({ status }) {
  const item = statuses[status] || statuses.draft;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${item.color}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {item.label}
    </span>
  );
}
