
import { useEffect, useState } from "react";
import { Bell, CheckCheck, RefreshCw } from "lucide-react";
import {
  getNotifications,
  markRead,
  markAllRead,
} from "../../../lib/api";
import StatusBadge from "../../../components/shared/StatusBadge";

function formatTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("uz-UZ", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotifications() {
    setLoading(true);
    setError("");

    try {
      const data = await getNotifications("admin");
      setNotifications(data);
    } catch (err) {
      setError(err.message || "Bildirishnomalarni yuklab bo'lmadi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleMarkRead(id) {
    try {
      await markRead(id);
      setNotifications((items) =>
        items.map((item) =>
          item.id === id ? { ...item, read: true } : item
        )
      );
    } catch (err) {
      setError(err.message || "Bildirishnomani yangilab bo'lmadi.");
    }
  }

  async function handleMarkAllRead() {
    try {
      const updated = await markAllRead("admin");
      setNotifications(updated);
    } catch (err) {
      setError(err.message || "Bildirishnomalarni yangilab bo'lmadi.");
    }
  }

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Bildirishnomalar
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Barcha xabarlar va yangiliklar.
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <CheckCheck size={17} />
          Barchasini o'qish
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        {error && (
          <p role="alert" className="p-4 text-sm text-red-600">
            {error}
          </p>
        )}

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Yuklanmoqda...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-10 text-center">
            <Bell className="mx-auto mb-3 text-slate-400" size={32} />
            <p className="font-medium text-slate-700">
              Bildirishnomalar yo'q
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Yangi xabarlar shu yerda ko'rinadi.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`flex flex-wrap items-center gap-4 p-5 ${
                  !item.read ? "bg-indigo-50/50" : ""
                }`}
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                  <Bell size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800">
                    {item.message}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatTime(item.time)}
                  </p>
                </div>

                <StatusBadge status={item.read ? "published" : "draft"} />

                {!item.read && (
                  <button
                    type="button"
                    onClick={() => handleMarkRead(item.id)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    O'qilgan
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={loadNotifications}
        disabled={loading}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 disabled:opacity-50"
      >
        <RefreshCw size={16} />
        Yangilash
      </button>
    </div>
  );
}
