import { NavLink, Navigate, Route, Routes } from "react-router-dom"
import { BookOpen, LayoutDashboard, GraduationCap } from "lucide-react"
import AdminGroupsPage from "./pages/admin/groups/AdminGroupsPage"
import AdminGroupDetailPage from "./pages/admin/groups/AdminGroupDetailPage"

function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
          <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <GraduationCap size={20} />
          </span>
          <div>
            <p className="font-semibold tracking-tight">EduManage</p>
            <p className="text-xs text-slate-500">Ta'lim platformasi</p>
          </div>
        </div>
        <nav aria-label="Asosiy navigatsiya" className="space-y-1 p-4">
          <p className="mb-2 px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Boshqaruv</p>
          <span className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-500">
            <LayoutDashboard size={18} />
            Bosh sahifa
          </span>
          <NavLink
            to="/admin/groups"
            className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <BookOpen size={18} />
            Guruhlar
          </NavLink>
        </nav>
        <div className="mt-auto border-t border-slate-200 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">A</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Administrator</p>
              <p className="truncate text-xs text-slate-500">Admin panel</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-8">
          <div className="font-medium text-slate-700 md:hidden">EduManage</div>
          <div className="hidden text-sm text-slate-500 md:block">Ta'lim boshqaruv tizimi</div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="flex size-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">A</span>
            Admin
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl p-5 sm:p-8">
          <Routes>
            <Route path="/admin/groups" element={<AdminGroupsPage />} />
            <Route path="/admin/groups/:id" element={<AdminGroupDetailPage />} />
            <Route path="*" element={<Navigate to="/admin/groups" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return <AdminLayout />
}
