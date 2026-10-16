import { useState } from "react";
import { UserRound, Mail, Phone, MapPin, Pencil } from "lucide-react";
import Avatar from "../../../components/shared/Avatar";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState({
    name: "Otabek Qahhorov",
    email: "otabek@example.com",
    phone: "+998 90 123 45 67",
    address: "Toshkent, O‘zbekiston",
    course: "Frontend dasturlash",
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  function handleSave(e) {
    e.preventDefault();
    setProfile(form);
    setEditing(false);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mening profilim</h1>
        <p className="mt-1 text-sm text-slate-500">
          Shaxsiy ma’lumotlaringizni ko‘rish va tahrirlash.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-6">
          <Avatar name={profile.name} size="lg" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900">
              {profile.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{profile.course}</p>
          </div>
          <button
            onClick={() => {
              setForm(profile);
              setEditing(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Pencil size={16} />
            Tahrirlash
          </button>
        </div>

        <div className="grid gap-6 pt-6 sm:grid-cols-2">
          <Info icon={<UserRound size={18} />} label="Ism-familiya" value={profile.name} />
          <Info icon={<Mail size={18} />} label="Elektron pochta" value={profile.email} />
          <Info icon={<Phone size={18} />} label="Telefon" value={profile.phone} />
          <Info icon={<MapPin size={18} />} label="Manzil" value={profile.address} />
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleSave}
            className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-xl font-bold text-slate-900">
              Profilni tahrirlash
            </h2>

            {[
              ["name", "Ism-familiya"],
              ["email", "Elektron pochta"],
              ["phone", "Telefon"],
              ["address", "Manzil"],
              ["course", "Kurs"],
            ].map(([key, label]) => (
              <label key={key} className="block space-y-1">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <input
                  required
                  type={key === "email" ? "email" : "text"}
                  value={form[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
            ))}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Saqlash
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600">{icon}</span>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}