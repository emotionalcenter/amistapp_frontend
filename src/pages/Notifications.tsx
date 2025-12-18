import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface NotificationRow {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);

    const { data } = await supabase
      .from("notifications")
      .select("id, title, message, read, created_at")
      .order("created_at", { ascending: false });

    setNotifications(data || []);
    setLoading(false);
  }

  async function markAsRead(id: string) {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Cargando notificaciones...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">
        Notificaciones 🔔
      </h1>

      {notifications.length === 0 && (
        <p className="text-gray-500">
          No tienes notificaciones por ahora.
        </p>
      )}

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl shadow-sm ${
              n.read
                ? "bg-white"
                : "bg-purple-50 border border-purple-200"
            }`}
            onClick={() => !n.read && markAsRead(n.id)}
          >
            <p className="font-semibold text-gray-800">
              {n.title}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {n.message}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(n.created_at).toLocaleString()}
            </p>

            {!n.read && (
              <p className="text-xs text-purple-600 mt-1 font-semibold">
                • No leída
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
