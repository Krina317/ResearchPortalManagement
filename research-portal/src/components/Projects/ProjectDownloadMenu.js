import React, { useEffect, useRef, useState } from "react";

const FORMATS = [
  { value: "csv", label: "Download CSV" },
  { value: "xlsx", label: "Download Excel (.xlsx)" },
  { value: "xls", label: "Download Excel 97-2003 (.xls)" },
  { value: "pdf", label: "Download PDF" },
];

function DownloadMenu({ disabled = false, exporting = false, onDownload }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // close the menu when clicking anywhere outside it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (format) => {
    setIsOpen(false);
    onDownload(format);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        disabled={disabled || exporting}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="cursor-pointer rounded-[7px] border border-gray-300 bg-white px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-white"
      >
        {exporting ? "Preparing..." : "Download ▾"}
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1.5 w-[250px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {FORMATS.map((format) => (
            <button
              key={format.value}
              type="button"
              role="menuitem"
              onClick={() => handleSelect(format.value)}
              className="block w-full cursor-pointer border-none bg-white px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              {format.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DownloadMenu;