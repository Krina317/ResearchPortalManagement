import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Newspaper,
  BookOpen,
  BookMarked,
  LayoutDashboard,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  HandCoins,
  Users,
  Landmark,
  FileBarChart,
  Library,
  Briefcase,
} from "lucide-react";

const topItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/faculty-metrics", label: "Faculty Metrics", icon: Users },
];

const groups = [
  {
    key: "publications",
    label: "Publications",
    icon: Library,
    items: [
      { path: "/conference", label: "Conference", icon: Newspaper },
      { path: "/journal", label: "Journal", icon: BookOpen },
      { path: "/book-chapters", label: "Book Chapters", icon: BookMarked },
    ],
  },
  {
    key: "reports",
    label: "Reports",
    icon: FileBarChart,
    items: [
      { path: "/journal/reports", label: "Journal Reports", icon: FileBarChart },
      { path: "/conference/reports", label: "Conference Reports", icon: FileBarChart },
    ],
  },
  {
    key: "projects",
    label: "Projects",
    icon: Briefcase,
    items: [
      { path: "/projects/nu", label: "NU Projects", icon: HandCoins },
      { path: "/projects/ext", label: "External Projects", icon: Landmark },
    ],
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // group is open if the user toggled it, or (by default) if a child page is active
  const [openGroups, setOpenGroups] = useState({});

  const groupHasActive = (group) =>
    group.items.some((item) => pathname === item.path);

  const isGroupOpen = (group) =>
    openGroups[group.key] !== undefined
      ? openGroups[group.key]
      : groupHasActive(group);

  const toggleGroup = (group) => {
    if (collapsed) {
      // clicking a group icon in the slim sidebar expands it and opens the group
      setCollapsed(false);
      setOpenGroups((prev) => ({ ...prev, [group.key]: true }));
      return;
    }
    setOpenGroups((prev) => ({ ...prev, [group.key]: !isGroupOpen(group) }));
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium tracking-tight transition-colors ${
      isActive
        ? "bg-emerald-50 text-emerald-700"
        : "text-gray-600 hover:bg-gray-50"
    } ${collapsed ? "md:justify-center md:px-0" : ""}`;

  const subLinkClasses = ({ isActive }) =>
    `flex items-center gap-2.5 pl-8 pr-3 py-1.5 rounded-md text-sm tracking-tight transition-colors ${
      isActive
        ? "bg-emerald-50 text-emerald-700 font-medium"
        : "text-gray-600 hover:bg-gray-50"
    }`;

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <div>
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            Nirma IQAC
          </span>
          <p className="text-xs text-gray-500 mt-1">Activity Portal</p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-md hover:bg-gray-100"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay for mobile when open */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full md:h-screen bg-white border-r border-gray-100
          flex flex-col p-3 z-30 transform transition-all duration-200 overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          ${collapsed ? "md:w-16" : "md:w-52"} w-52
        `}
      >
        <div className="mb-6 px-2 hidden md:flex items-start justify-between">
          {!collapsed && (
            <div>
              <span className="text-lg font-semibold tracking-tight text-gray-900">
                Nirma IQAC
              </span>
              <p className="text-xs text-gray-500 mt-1">Activity Portal</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-500 shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {!collapsed && (
          <p className="text-[11px] font-semibold text-gray-400 px-2 mb-1.5 tracking-wider uppercase">
            Menu
          </p>
        )}

        <nav className="flex flex-col gap-0.5">
          {/* Top-level links */}
          {topItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              className={linkClasses}
              onClick={() => setIsOpen(false)}
              title={collapsed ? label : undefined}
            >
              <Icon size={16} />
              {!collapsed && <span className="md:inline">{label}</span>}
            </NavLink>
          ))}

          {/* Dropdown groups */}
          {groups.map((group) => {
            const GroupIcon = group.icon;
            const open = isGroupOpen(group) && !collapsed;
            const active = groupHasActive(group);

            return (
              <div key={group.key} className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => toggleGroup(group)}
                  title={collapsed ? group.label : undefined}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium tracking-tight transition-colors w-full ${
                    active ? "text-emerald-700" : "text-gray-600 hover:bg-gray-50"
                  } ${collapsed ? "md:justify-center md:px-0" : ""}`}
                >
                  <GroupIcon size={16} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{group.label}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </>
                  )}
                </button>

                {open &&
                  group.items.map(({ path, label }) => (
                    <NavLink
                      key={path}
                      to={path}
                      end
                      className={subLinkClasses}
                      onClick={() => setIsOpen(false)}
                    >
                      <span>{label}</span>
                    </NavLink>
                  ))}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}