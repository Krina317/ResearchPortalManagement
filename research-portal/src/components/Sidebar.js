import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Newspaper, BookOpen, BookMarked, LayoutDashboard, Menu, X,
  ChevronLeft, ChevronRight, ChevronDown, HandCoins, Users, Landmark,
  FileBarChart, Library, Briefcase, FolderOpen, Settings, LogOut, FileSignature, Lightbulb,
} from "lucide-react";
import { useAuth } from "./AuthContext";

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
      { path: "/projects/ext/reports", label: "External Project Reports", icon: FileBarChart },
      { path: "/projects/nu/reports", label: "NU Project Reports", icon: FileBarChart },
    ],
  },
  {
    key: "projects",
    label: "Projects",
    icon: FolderOpen,
    items: [
      { path: "/projects/nu", label: "NU Projects", icon: HandCoins },
      { path: "/projects/ext", label: "External Projects", icon: Landmark },
    ],
  },
];

// Shown after the groups
const bottomItems = [
  { path: "/patents", label: "Patents", icon: Lightbulb },
  { path: "/consultancy", label: "Consultancy", icon: Briefcase },
  { path: "/mou", label: "MoUs", icon: FileSignature },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState({});
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const groupHasActive = (group) => group.items.some((item) => pathname === item.path);
  const isGroupOpen = (group) =>
    openGroups[group.key] !== undefined ? openGroups[group.key] : groupHasActive(group);

  const toggleGroup = (group) => {
    if (collapsed) {
      setCollapsed(false);
      setOpenGroups((prev) => ({ ...prev, [group.key]: true }));
      return;
    }
    setOpenGroups((prev) => ({ ...prev, [group.key]: !isGroupOpen(group) }));
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium tracking-tight transition-colors ${
      isActive ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"
    } ${collapsed ? "md:justify-center md:px-0" : ""}`;

  const subLinkClasses = ({ isActive }) =>
    `flex items-center gap-2.5 pl-8 pr-3 py-1.5 rounded-md text-sm tracking-tight transition-colors ${
      isActive ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-600 hover:bg-gray-50"
    }`;

  const renderLink = ({ path, label, icon: Icon }) => (
    <NavLink
      key={path}
      to={path}
      end
      className={linkClasses}
      onClick={() => setIsOpen(false)}
      title={collapsed ? label : undefined}
    >
      <Icon size={16} />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );

  const name = user?.name || user?.email || "";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <div>
          <span className="text-lg font-semibold tracking-tight text-gray-900">FORGE</span>
          <p className="text-xs text-gray-500 mt-1">Nirma University</p>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 rounded-md hover:bg-gray-100">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/30 z-20" onClick={() => setIsOpen(false)} />
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 h-full md:h-screen bg-white border-r border-gray-100
          flex flex-col p-3 z-30 transform transition-all duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          ${collapsed ? "md:w-16" : "md:w-52"} w-52
        `}
      >
        <div className="mb-6 px-2 hidden md:flex items-start justify-between">
          {!collapsed && (
            <div>
              <span className="text-lg font-semibold tracking-tight text-gray-900">FORGE</span>
              <p className="text-xs text-gray-500 mt-1">Nirma University</p>
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

        {/* Scrollable nav area */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {!collapsed && (
            <p className="text-[11px] font-semibold text-gray-400 px-2 mb-1.5 tracking-wider uppercase">
              Menu
            </p>
          )}

          <nav className="flex flex-col gap-0.5">
            {topItems.map(renderLink)}

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
                        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
                      </>
                    )}
                  </button>
                  {open &&
                    group.items.map(({ path, label }) => (
                      <NavLink key={path} to={path} end className={subLinkClasses} onClick={() => setIsOpen(false)}>
                        <span>{label}</span>
                      </NavLink>
                    ))}
                </div>
              );
            })}

            {bottomItems.map(renderLink)}
          </nav>
        </div>

        {/* Profile, pinned to the bottom */}
        <div className="relative pt-3 mt-3 border-t border-gray-100" ref={profileRef}>
          {profileOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <button className="flex items-center gap-2.5 w-full px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700">
                <Settings size={16} /> Settings
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 hover:bg-red-50 text-sm text-red-600"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}

          <button
            onClick={() => setProfileOpen(!profileOpen)}
            title={collapsed ? name : undefined}
            className={`flex items-center gap-2.5 w-full rounded-md p-1.5 hover:bg-gray-50 transition-colors ${
              collapsed ? "md:justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {initials}
            </div>
            {!collapsed && (
              <div className="min-w-0 text-left">
                <p className="text-sm font-medium text-gray-800 truncate leading-tight">{user?.name}</p>
                <p className="text-[11px] text-gray-500 truncate leading-tight">{user?.email}</p>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}