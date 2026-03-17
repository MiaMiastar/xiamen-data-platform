import { useState } from "react";
import { NavLink } from "react-router";
import {
  FileSearch,
  BarChart2,
  FlaskConical,
  BarChart,
  Database,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "数据解析",
    items: [
      { to: "/parse-tasks", label: "解析任务", icon: FileSearch },
    ],
  },
  {
    label: "数据评估",
    items: [
      { to: "/eval-tasks", label: "评估任务", icon: FlaskConical },
    ],
  },
  {
    label: "数据管理",
    items: [
      { to: "/datasets", label: "数据集", icon: Database },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [tooltip, setTooltip] = useState<string | null>(null);

  return (
    <aside
      className="relative flex flex-col shrink-0 h-full select-none"
      style={{
        background: "#14131A",
        width: collapsed ? 56 : 216,
        transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center shrink-0 overflow-hidden"
        style={{
          height: 52,
          padding: collapsed ? "0 14px" : "0 14px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
            style={{ background: "#5E6AD2" }}
          >
            <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <div
            className="overflow-hidden"
            style={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              transition: "opacity 0.18s, width 0.22s",
              whiteSpace: "nowrap",
            }}
          >
            <span
              className="text-white"
              style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              DataFlow
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden py-3"
        style={{ padding: collapsed ? "12px 8px" : "12px 8px" }}
      >
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            {/* Section label */}
            <div
              style={{
                height: collapsed ? 0 : "auto",
                opacity: collapsed ? 0 : 1,
                marginBottom: collapsed ? 0 : 4,
                overflow: "hidden",
                transition: "all 0.18s",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  padding: "0 8px",
                  whiteSpace: "nowrap",
                }}
              >
                {section.label}
              </div>
            </div>

            {/* Items */}
            {section.items.map(({ to, label, icon: Icon, end }) => (
              <div
                key={to}
                className="relative mb-0.5"
                onMouseEnter={() => collapsed && setTooltip(to)}
                onMouseLeave={() => setTooltip(null)}
              >
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center rounded-md overflow-hidden transition-all duration-100 ${
                      isActive ? "" : "hover:bg-white/5"
                    }`
                  }
                  style={({ isActive }) => ({
                    background: isActive ? "rgba(94,106,210,0.18)" : undefined,
                    color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.6)",
                    padding: collapsed ? "7px 0" : "6px 8px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    gap: collapsed ? 0 : 8,
                  })}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && !collapsed && (
                        <span
                          className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full"
                          style={{ background: "#5E6AD2" }}
                        />
                      )}
                      <Icon
                        className="w-4 h-4 shrink-0"
                        style={{ color: isActive ? "#A0ACEA" : "rgba(255,255,255,0.5)" }}
                      />
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: isActive ? 600 : 400,
                          opacity: collapsed ? 0 : 1,
                          width: collapsed ? 0 : "auto",
                          maxWidth: collapsed ? 0 : 140,
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          transition: "opacity 0.12s, max-width 0.22s, width 0.22s",
                        }}
                      >
                        {label}
                      </span>
                    </>
                  )}
                </NavLink>

                {/* Tooltip when collapsed */}
                {collapsed && tooltip === to && (
                  <div
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-2.5 px-2.5 py-1.5 rounded-md text-white whitespace-nowrap z-50 shadow-xl pointer-events-none"
                    style={{
                      background: "#2D2C3A",
                      border: "1px solid rgba(255,255,255,0.08)",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {label}
                    <div
                      className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent"
                      style={{ borderRightColor: "#2D2C3A" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="flex items-center shrink-0 overflow-hidden"
        style={{
          height: 52,
          padding: collapsed ? "0 14px" : "0 12px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          transition: "padding 0.22s",
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0"
            style={{ background: "#5E6AD2", fontSize: 10, fontWeight: 700 }}
          >
            管
          </div>
          <div
            className="overflow-hidden flex-1 min-w-0"
            style={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              transition: "opacity 0.18s, width 0.22s",
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 500, color: "#D0D0DC" }}>管理员</div>
            <div style={{ fontSize: 12, color: "#5A5A72" }}>admin@company.com</div>
          </div>
          {/* Toggle inside footer */}
          {!collapsed && (
            <button
              onClick={onToggle}
              className="shrink-0 p-1 rounded-md hover:bg-white/8 transition-colors"
              style={{ color: "#4A4A62" }}
              title="收起导航"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-white/8 transition-colors"
            style={{ color: "#4A4A62" }}
            title="展开导航"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}