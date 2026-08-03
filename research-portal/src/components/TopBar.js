import { useState, useRef, useEffect } from "react";
import { UserCircle2, Settings, LogOut } from "lucide-react";

export default function TopBar() {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-end px-8">

      <div className="relative" ref={dropdownRef}>

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              Ashwin Verma
            </p>

            <p className="text-xs text-gray-500">
              ashwinverma@nirmauni.ac.in
            </p>
          </div>

          <UserCircle2
            size={42}
            className="text-emerald-600"
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">

            <div className="px-5 py-4 border-b">

              <p className="font-semibold text-gray-800">
                Ashwin Verma
              </p>

              <p className="text-sm text-gray-500">
                ashwinverma@nirmauni.ac.in
              </p>

            </div>

            <button className="flex items-center gap-3 w-full px-5 py-3 hover:bg-gray-50 text-sm">
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