import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "#F7F8FA" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main className="flex-1 overflow-auto min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
