import { BarChart3, GraduationCap } from "lucide-react";

const developers = [
  { name: "Krina Shah", roll: "24BCE292" },
  { name: "Krisha Shah", roll: "24BCE293" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 px-8 py-5">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">

        {/* Left: portal identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <BarChart3 size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              Nirma IQAC Activity Portal
            </p>
            <p className="text-xs text-gray-400 leading-tight">
              Internal Quality Assurance Cell
            </p>
          </div>
        </div>

        {/* Center: developer credits */}
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Developed by
          </p>
          <p className="text-xs text-gray-600">
            <span className="font-medium text-gray-800">{developers[0].name}</span>
            <span className="text-gray-400"> ({developers[0].roll})</span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="font-medium text-gray-800">{developers[1].name}</span>
            <span className="text-gray-400"> ({developers[1].roll})</span>
          </p>
        </div>

        {/* Right: institution */}
        <div className="text-center md:text-right">
          <p className="flex items-center justify-center md:justify-end gap-1.5 text-xs font-medium text-gray-700">
            <GraduationCap size={14} className="text-emerald-600" />
            Institute of Technology, Nirma University
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            © {year} Nirma University. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}