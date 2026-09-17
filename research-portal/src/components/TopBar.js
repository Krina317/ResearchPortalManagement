import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Settings, LogOut, ChevronDown } from "lucide-react";

const PAGE_TITLES = [
  { prefix: "/conference", label: "Conference Papers" },
  { prefix: "/journal", label: "Journal Papers" },
  { prefix: "/book-chapters", label: "Book Chapters" },
  { prefix: "/projects/ext", label: "External Funded Projects" },
  { prefix: "/projects/nu", label: "NU Funded Projects" },
  { prefix: "/consultancy", label: "Consultancy" },
  { prefix: "/mou", label: "MoUs" },
  { prefix: "/", label: "Dashboard" },
];

function getPageTitle(pathname) {
  const match = PAGE_TITLES.find((p) => pathname.startsWith(p.prefix) && p.prefix !== "/");
  if (match) return match.label;
  return pathname === "/" ? "Dashboard" : "";
}

export default function TopBar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const user = {
    name: "Jitendra Bhatia",
    email: "jitendrabhatia@nirmauni.ac.in",
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageTitle = getPageTitle(location.pathname);
  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
      <div>
        <p className="text-sm font-semibold text-gray-800">{pageTitle}</p>
        <p className="text-xs text-gray-400">Nirma IQAC Activity Portal</p>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2.5 hover:bg-gray-100 rounded-lg px-2.5 py-1.5 transition"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{user.name}</p>
            <p className="text-xs text-gray-500 leading-tight">{user.email}</p>
          </div>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
            <div className="px-5 py-4 border-b flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <button className="flex items-center gap-3 w-full px-5 py-3 hover:bg-gray-50 text-sm text-gray-700">
              <Settings size={18} />
              Settings
            </button>
            <button className="flex items-center gap-3 w-full px-5 py-3 hover:bg-red-50 text-sm text-red-600">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}