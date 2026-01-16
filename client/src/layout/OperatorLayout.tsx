import { Outlet } from "react-router-dom";
import OperatorNavbar from "../components/operator/OperatorNavbar";

export default function OperatorLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-base-200">
        Operator Sidebar
      </aside>

      {/* Main area */}
      <div className="flex-1">
        {/* Navbar */}
        <header className="h-16 bg-base-100 shadow">
          <OperatorNavbar />
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}