import { useCallback, useState } from "react";
import {
    fetchBookChapterMonthly,
    fetchBookChapterStatistics
} from "../../api/bookChapterApi";
import ReportFilterBar from "../Reports/ReportFilterBar";
import {
    EMPTY_FILTERS, COLLAPSED_ROWS, useReport, ReportCard, ViewAllFooter,
    BarChart, CountTable, th, td, tdTotal
} from "../JournalReports/JournalReportsPage";

const EMPTY_MONTHLY = { totalChapters: 0, monthly: [] };

export default function BookChapterReportsPage() {
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [applied, setApplied] = useState(EMPTY_FILTERS);
    const [showAllStats, setShowAllStats] = useState(false);

    const loadMonthly = useCallback(() => fetchBookChapterMonthly(applied), [applied]);
    const monthly = useReport(loadMonthly, EMPTY_MONTHLY);
    const stats = useReport(fetchBookChapterStatistics);

    const updateFilter = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));
    const resetFilters = () => {
        setFilters(EMPTY_FILTERS);
        setApplied(EMPTY_FILTERS);
    };

    const monthlyData = monthly.data.monthly.map(m => ({ label: m.month, value: m.count }));

    /* ---------- statistics (same logic as journal) ---------- */
    const statYears = [
        ...new Set(stats.data.flatMap(r => Object.keys(r.counts ?? {})))
    ].sort();

    const rowTotal = row =>
        statYears.reduce((sum, year) => {
            const v = row.counts?.[year];
            return typeof v === "number" ? sum + v : sum;
        }, 0);

    const sortedStats = [...stats.data].sort(
        (a, b) => rowTotal(b) - rowTotal(a) || a.facultyName.localeCompare(b.facultyName)
    );
    const visibleStats = showAllStats ? sortedStats : sortedStats.slice(0, COLLAPSED_ROWS);

    const statTotals = Object.fromEntries(
        statYears.map(year => [
            year,
            stats.data.reduce((sum, row) => {
                const v = row.counts?.[year];
                return typeof v === "number" ? sum + v : sum;
            }, 0)
        ])
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Book Chapter Reports</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Month-wise publications and faculty statistics.
                    </p>
                </div>

                <ReportFilterBar
                    mode="monthYear"
                    showQuartile={false}
                    filters={filters}
                    onChange={updateFilter}
                    onApply={() => setApplied(filters)}
                    onReset={resetFilters}
                />

                {/* ============ MONTH-WISE PUBLICATIONS ============ */}
                <ReportCard
                    title="Month-wise book chapter publications"
                    subtitle={`${monthly.data.totalChapters} book chapters in the selected period.`}
                    loading={monthly.loading}
                    error={monthly.error}
                >
                    {monthlyData.length === 0 ? (
                        <p className="px-5 py-10 text-center text-gray-500">
                            No book chapters for this period.
                        </p>
                    ) : (
                        <>
                            <CountTable data={monthlyData} rowLabel="Chapters" />
                            <BarChart data={monthlyData} compact />
                        </>
                    )}
                </ReportCard>

                {/* ============ STATISTICS ============ */}
                <ReportCard
                    title="Book chapter statistics"
                    subtitle="Book chapters each faculty took part in, by academic year. NA = former faculty with no chapters that year."
                    loading={stats.loading}
                    error={stats.error}
                >
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-max border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className={th}>S. No.</th>
                                    <th className={th}>Name</th>
                                    {statYears.map(year => (
                                        <th key={year} className={th}>{year}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {stats.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={2 + statYears.length} className="px-6 py-10 text-center text-gray-500">
                                            No statistics yet.
                                        </td>
                                    </tr>
                                ) : (
                                    visibleStats.map((row, index) => (
                                        <tr key={row.facultyId ?? row.facultyName} className="hover:bg-gray-50">
                                            <td className={td}>{index + 1}</td>
                                            <td className={td}>{row.facultyName}</td>
                                            {statYears.map(year => (
                                                <td key={year} className={td}>
                                                    {row.counts?.[year] === "NA" ? (
                                                        <span className="text-gray-400">NA</span>
                                                    ) : (
                                                        row.counts?.[year] ?? "—"
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            {stats.data.length > 0 && (
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan={2} className={tdTotal}>
                                            Total ({stats.data.length} faculty)
                                        </td>
                                        {statYears.map(year => (
                                            <td key={year} className={tdTotal}>{statTotals[year]}</td>
                                        ))}
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>

                    <ViewAllFooter
                        shown={visibleStats.length}
                        total={stats.data.length}
                        expanded={showAllStats}
                        onToggle={() => setShowAllStats(v => !v)}
                        noun="faculty"
                    />
                </ReportCard>
            </div>
        </div>
    );
}