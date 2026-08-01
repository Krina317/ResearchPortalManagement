import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Newspaper,
  BookOpen,
  BookMarked,
  UploadCloud,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { path: "/conference", label: "Conference", icon: Newspaper },
  { path: "/journal", label: "Journal", icon: BookOpen },
  { path: "/book-chapters", label: "Book Chapters", icon: BookMarked },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium tracking-tight transition-colors ${
      isActive
        ? "bg-emerald-50 text-emerald-700"
        : "text-gray-600 hover:bg-gray-50"
    }`;

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <span className="text-lg font-semibold tracking-tight">
          Research Portal
        </span>
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
          fixed md:static top-0 left-0 h-full md:h-screen w-40 bg-white border-r border-gray-100
          flex flex-col p-3 z-30 transform transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <div className="mb-6 px-2 hidden md:block">
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            Research Portal
          </span>
        </div>

        <p className="text-[11px] font-semibold text-gray-400 px-2 mb-1.5 tracking-wider uppercase">
          Menu
        </p>

        <nav className="flex flex-col gap-0.5">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={linkClasses}
              onClick={() => setIsOpen(false)}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="my-3 border-t border-gray-100" />

        <NavLink
          to="/upload"
          className={linkClasses}
          onClick={() => setIsOpen(false)}
        >
          <UploadCloud size={16} />
          Upload File (.xls)
        </NavLink>
      </aside>
    </>
  );
}