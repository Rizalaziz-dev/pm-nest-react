import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 text-xl font-bold">My App</header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}