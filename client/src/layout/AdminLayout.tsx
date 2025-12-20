import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-base-200">
        Admin Sidebar
      </aside>

      {/* Main area */}
      <div className="flex-1">
        {/* Navbar */}
        <header className="h-16 bg-base-100 shadow">
          <AdminNavbar />
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}