
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Users,
  MessageCircle,
  Ban,
  CheckCheck,
  ArrowRight,
} from "lucide-react";
import {
  getNotifications,
  markRead as markNotificationRead,
  markAllRead as markAllNotificationsRead,
} from "../../lib/api";

const notificationIcons = {
  new_lesson: BookOpen,
  added_to_group: Users,
  comment: MessageCircle,
  removed_from_group: Ban,
};

function formatTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);

  if (minutes < 1) return "Hozirgina";
  if (minutes < 60) return `${minutes} daqiqa oldin`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} soat oldin`;

  const days = Math.floor(hours / 24);
  return `${days} kun oldin`;
}

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;

    getNotifications("admin")
      .then((data) => {
        if (active) setNotifications(data);
      })
      .catch((error) => {
        console.error("Bildirishnomalarni yuklashda xato:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  async function handleMarkAllRead() {
    setNotifications((items) =>
      items.map((item) => ({ ...item, read: true }))
    );

    try {
      await markAllNotificationsRead("admin");
    } catch (error) {
      console.error("Bildirishnomalarni belgilashda xato:", error);

      try {
        const data = await getNotifications("admin");
        setNotifications(data);
      } catch (reloadError) {
        console.error(reloadError);
      }
    }
  }

  async function handleMarkRead(id) {
    setNotifications((items) =>
      items.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );

    try {
      await markNotificationRead(id);
    } catch (error) {
      console.error("Bildirishnomani belgilashda xato:", error);

      try {
        const data = await getNotifications("admin");
        setNotifications(data);
      } catch (reloadError) {
        console.error(reloadError);
      }
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Bildirishnomalarni ochish"
        aria-expanded={open}
        className="relative flex size-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
      >
        <Bell size={21} />

        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Panelni yopish"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default"
          />

          <section
            aria-label="Bildirishnomalar ro'yxati"
            className="absolute right-0 z-40 mt-2 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4">
              <h2 className="font-semibold text-slate-900">
                Bildirishnomalar
              </h2>

              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:cursor-not-allowed disabled:text-slate-400"
              >
                Barchasini o'qi
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-6 text-center text-sm text-slate-500">
                  Hozircha bildirishnomalar yo'q.
                </p>
              ) : (
                notifications.map((notification) => {
                  const Icon =
                    notificationIcons[notification.type] || Bell;

                  return (
                    <Link
                      key={notification.id}
                      to={notification.href || "/admin/groups"}
                      onClick={() => {
                        handleMarkRead(notification.id);
                        setOpen(false);
                      }}
                      className={`flex gap-3 border-b border-slate-100 p-4 transition-colors hover:bg-slate-50 ${
                        !notification.read ? "bg-indigo-50/60" : ""
                      }`}
                    >
                      <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                        <Icon size={19} />

                        {!notification.read && (
                          <span className="absolute -left-1 top-1 size-2.5 rounded-full bg-indigo-600" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-slate-800">
                          {notification.message}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatTime(notification.time)}
                        </p>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            <Link
              to="/admin/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 p-4 text-sm font-medium text-indigo-600 hover:bg-slate-50"
            >
              Barcha bildirishnomalar
              <ArrowRight size={16} />
            </Link>

            {unreadCount === 0 && notifications.length > 0 && (
              <div className="flex items-center justify-center gap-2 px-4 pb-3 text-xs text-green-700">
                <CheckCheck size={15} />
                Barcha bildirishnomalar o'qilgan
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
