import { getDateOptions } from "../../utils/dateOptions";
import DateFilter from "../Publication/filters/DateFilter";
import MonthRangeFilter from "../Publication/filters/MonthRangeFilter";

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

/* mode: "date" (conference) or "monthYear" (journal) */
export default function ReportFilterBar({ mode, filters, onChange, onApply, onReset }) {
    const { months, years, academicYears, financialYears } = getDateOptions();

    return (
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
            <div>
                <h2 className="font-semibold text-gray-800">Filter by period</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Applies to faculty scores and student authors. An exact range overrides the year filters.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
        </section>
    );
}