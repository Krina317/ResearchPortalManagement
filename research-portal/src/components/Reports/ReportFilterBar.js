import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getDateOptions } from "../../utils/dateOptions";
import DateFilter from "../Publication/filters/DateFilter";
import MonthRangeFilter from "../Publication/filters/MonthRangeFilter";

const QUARTILE_OPTIONS = [
    { value: "", label: "All" },
    { value: "Q1", label: "Q1" },
    { value: "Q2", label: "Q2" },
    { value: "Q1+Q2", label: "Q1 + Q2" }
];

function YearSelect({ label, hint, value, options, onChange }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                <span className="text-gray-400 text-xs ml-2">{hint}</span>
            </label>
            <select
                value={value || "All"}
                onChange={e => onChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
            >
                <option value="All">All</option>
                {options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
        </div>
    );
}

function QuartileFilter({ value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Quartile
            </label>
            <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
                {QUARTILE_OPTIONS.map(o => {
                    const active = (value || "") === o.value;
                    return (
                        <button
                            key={o.label}
                            type="button"
                            onClick={() => onChange(o.value)}
                            className={`px-4 py-2 text-sm border-r border-gray-300 last:border-r-0 ${
                                active
                                    ? "bg-emerald-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            {o.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* mode: "date" (conference) or "monthYear" (journal) */
export default function ReportFilterBar({ mode, filters, onChange, onApply, onReset }) {
    const { months, years, academicYears, financialYears } = getDateOptions();
    const [open, setOpen] = useState(false);

    // how many filters are currently set (ignores empty and "All")
    const activeCount = Object.values(filters).filter(v => v && v !== "All").length;

    return (
        <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
            >
                <div>
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                        Filter by period
                        {activeCount > 0 && (
                            <span className="text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5">
                                {activeCount} active
                            </span>
                        )}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Applies to faculty scores, student authors and graphs. An exact range overrides the year filters.
                    </p>
                </div>
                {open
                    ? <ChevronUp size={20} className="text-gray-500 shrink-0" />
                    : <ChevronDown size={20} className="text-gray-500 shrink-0" />}
            </button>

            {open && (
                <div className="px-5 pb-5 pt-1 space-y-5 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5">
                        <YearSelect
                            label="Academic Year"
                            hint="(July - June)"
                            value={filters.academicYear}
                            options={academicYears}
                            onChange={v => onChange("academicYear", v)}
                        />
                        <YearSelect
                            label="Financial Year"
                            hint="(April - March)"
                            value={filters.financialYear}
                            options={financialYears}
                            onChange={v => onChange("financialYear", v)}
                        />
                        <YearSelect
                            label="Calendar Year"
                            hint="(January - December)"
                            value={filters.calendarYear}
                            options={years}
                            onChange={v => onChange("calendarYear", v)}
                        />
                    </div>

                    <QuartileFilter
                        value={filters.quartile}
                        onChange={v => onChange("quartile", v)}
                    />

                    {mode === "date" ? (
                        <DateFilter
                            fromDate={filters.fromDate ?? ""}
                            toDate={filters.toDate ?? ""}
                            onChange={onChange}
                        />
                    ) : (
                        <MonthRangeFilter
                            fromMonth={filters.fromMonth ?? ""}
                            toMonth={filters.toMonth ?? ""}
                            fromYear={filters.fromYear ?? ""}
                            toYear={filters.toYear ?? ""}
                            monthOptions={months}
                            yearOptions={years}
                            onChange={onChange}
                        />
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onReset}
                            className="px-5 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={onApply}
                            className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}