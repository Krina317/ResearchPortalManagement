import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
    fetchConferenceFacultyScores,
    fetchConferenceStudentCounts,
    fetchConferenceReviewAuthors,
    decideConferenceReviewAuthor
} from "../../api/conferenceApi";
import ReportFilterBar from "../Reports/ReportFilterBar";

const EMPTY_FILTERS = {
    academicYear: "", financialYear: "", calendarYear: "",
    fromDate: "", toDate: "",
    quartile: ""
};

const STUDENT_TYPES = ["UG", "PG", "PHD"];

// pie colours (hex, used in SVG + legend)
const PIE_COLORS = ["#047857", "#10b981", "#6ee7b7", "#f59e0b", "#6366f1", "#ec4899"];

// how many rows are visible before "View all"
const COLLAPSED_ROWS = 5;

const TABS = [
    { id: "scores", label: "Faculty Scores" },
    { id: "graphs", label: "Graphs" },
    { id: "stats", label: "Conference Statistics" }
];

/* Loads one report and tracks its own loading / error state. */
function useReport(loader) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tick, setTick] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError("");

        loader()
            .then(result => {
                if (!cancelled) setData(result ?? []);
            })
            .catch(err => {
                console.error(err);
                if (!cancelled) setError("Could not load this report. Is the backend running?");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [loader, tick]);

    return { data, loading, error, reload: () => setTick(t => t + 1) };
}

function ReportCard({ title, subtitle, loading, error, className = "", children }) {
    return (
        <section className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
            <div className="px-5 py-4 border-b">
                <h2 className="font-semibold text-gray-800">{title}</h2>
                {subtitle && (
                    <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 size={26} className="animate-spin text-emerald-600" />
                </div>
            ) : error ? (
                <p className="px-5 py-6 text-sm text-red-600">{error}</p>
            ) : (
                children
            )}
        </section>
    );
}

/* Sheet-style tab bar: the active tab joins the content below it. */
function ReportTabs({ active, onChange }) {
    return (
        <div role="tablist" className="flex gap-1 border-b border-gray-300">
            {TABS.map(tab => {
                const isActive = tab.id === active;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onChange(tab.id)}
                        className={`px-5 py-2.5 text-sm rounded-t-lg border -mb-px ${
                            isActive
                                ? "bg-white border-gray-300 border-b-white text-emerald-700 font-semibold"
                                : "bg-gray-100 border-transparent text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}

/* Footer with "Showing X of N" and the View all / Show less toggle. */
function ViewAllFooter({ shown, total, expanded, onToggle, noun }) {
    if (total <= COLLAPSED_ROWS) return null;

    return (
        <div className="px-5 py-3 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
                Showing {shown} of {total} {noun}
            </p>
            <button
                type="button"
                onClick={onToggle}
                className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
                {expanded ? "Show less" : "View all"}
            </button>
        </div>
    );
}

/* Simple SVG pie chart with a legend, no chart library needed. data: [{ label, value }] */
function PieChart({ data }) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const cx = 90, cy = 90, r = 80;

    const point = angle => [
        cx + r * Math.cos(angle - Math.PI / 2),
        cy + r * Math.sin(angle - Math.PI / 2)
    ];

    let start = 0;
    const slices = data.map((d, i) => {
        const color = PIE_COLORS[i % PIE_COLORS.length];
        const angle = total > 0 ? (d.value / total) * 2 * Math.PI : 0;
        const end = start + angle;
        const [x1, y1] = point(start);
        const [x2, y2] = point(end);
        const large = angle > Math.PI ? 1 : 0;
        const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
        start = end;
        return { ...d, color, angle, path };
    });

    return (
        <div className="flex flex-col items-center gap-4 px-5 py-6">
            <svg viewBox="0 0 180 180" className="w-44 h-44">
                {total === 0 ? (
                    <circle cx={cx} cy={cy} r={r} fill="#e5e7eb" />
                ) : (
                    slices.map(s =>
                        s.value === total ? (
                            <circle key={s.label} cx={cx} cy={cy} r={r} fill={s.color} />
                        ) : s.value > 0 ? (
                            <path key={s.label} d={s.path} fill={s.color} stroke="#fff" strokeWidth="1.5" />
                        ) : null
                    )
                )}
            </svg>

            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1">
                {slices.map(s => (
                    <li key={s.label} className="flex items-center gap-2 text-sm text-gray-700">
                        <span
                            className="inline-block w-3 h-3 rounded-sm"
                            style={{ backgroundColor: s.color }}
                        />
                        {s.label}
                        <span className="font-semibold">
                            {s.value}
                            {total > 0 && ` (${Math.round((s.value / total) * 100)}%)`}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* Horizontal table: labels across the top, one row of counts below.
   data: [{ label, value }] */
function CountTable({ data, rowLabel = "Papers" }) {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full min-w-max border-collapse">
                <thead className="bg-gray-50">
                    <tr>
                        <th className={th}></th>
                        {data.map(d => (
                            <th key={d.label} className={`${th} text-center`}>{d.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className={`${td} font-semibold`}>{rowLabel}</td>
                        {data.map(d => (
                            <td key={d.label} className={`${td} text-center font-semibold`}>{d.value}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

const th = "px-4 py-3 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap";
const td = "px-4 py-3 text-sm text-gray-700 border-b last:border-b-0";
const tdTotal = "px-4 py-3 text-sm font-semibold text-gray-800 border-t-2 border-gray-200";

export default function ConferenceReportsPage() {
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [applied, setApplied] = useState(EMPTY_FILTERS);
    const [activeTab, setActiveTab] = useState("scores");
    const [showAllScores, setShowAllScores] = useState(false);

    const loadScores = useCallback(() => fetchConferenceFacultyScores(applied), [applied]);
    const loadCounts = useCallback(() => fetchConferenceStudentCounts(applied), [applied]);

    const scores = useReport(loadScores);
    const counts = useReport(loadCounts);
    const review = useReport(fetchConferenceReviewAuthors);

    const updateFilter = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));
    const resetFilters = () => {
        setFilters(EMPTY_FILTERS);
        setApplied(EMPTY_FILTERS);
    };

    const [busyId, setBusyId] = useState(null);
    const [actionError, setActionError] = useState("");

    // Confirm = link the author to the suggested faculty; otherwise mark as not faculty.
    async function handleDecision(author, isFaculty) {
        setBusyId(author.authorId);
        setActionError("");

        try {
            await decideConferenceReviewAuthor(
                author.authorId,
                isFaculty,
                isFaculty ? author.suggestedFacultyId : undefined
            );
            review.reload();
            scores.reload(); // scores change once an author is confirmed
        } catch (err) {
            console.error(err);
            setActionError(`Could not save the decision for ${author.displayName}.`);
        } finally {
            setBusyId(null);
        }
    }

    /* ---------- Faculty scores ---------- */

    // highest score first
    const sortedScores = [...scores.data].sort(
        (a, b) => b.conferenceScore - a.conferenceScore
    );

    const visibleScores = showAllScores
        ? sortedScores
        : sortedScores.slice(0, COLLAPSED_ROWS);

    // total of ALL faculty, not just the visible rows
    const totalScore = sortedScores.reduce(
        (sum, row) => sum + Number(row.conferenceScore || 0),
        0
    );

    /* ---------- Student counts (graphs tab) ---------- */

    // always show UG, PG, PHD in that order, even if the API omits one
    const countByType = Object.fromEntries(
        counts.data.map(c => [c.studentType, c.count])
    );

    const studentPieData = STUDENT_TYPES.map(type => ({
        label: type,
        value: Number(countByType[type] ?? 0)
    }));

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Conference Reports
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Faculty scores, student author graphs and conference statistics.
                    </p>
                </div>

                <ReportFilterBar
                    mode="date"
                    filters={filters}
                    onChange={updateFilter}
                    onApply={() => setApplied(filters)}
                    onReset={resetFilters}
                />

                <div className="space-y-4">
                    <ReportTabs active={activeTab} onChange={setActiveTab} />

                    {/* ================= FACULTY SCORES ================= */}
                    {activeTab === "scores" && (
                        <div className="space-y-6">
                            <ReportCard
                                title="Faculty scores"
                                subtitle="Each paper gives one point, split equally between its NU faculty."
                                loading={scores.loading}
                                error={scores.error}
                            >
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full min-w-max border-collapse">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className={th}>Sr. No.</th>
                                                <th className={th}>Faculty Name</th>
                                                <th className={th}>Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedScores.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                                                        No faculty scores yet.
                                                    </td>
                                                </tr>
                                            ) : (
                                                visibleScores.map((row, index) => (
                                                    <tr key={row.facultyId} className="hover:bg-gray-50">
                                                        <td className={td}>{index + 1}</td>
                                                        <td className={td}>{row.facultyName}</td>
                                                        <td className={td}>
                                                            {Number(row.conferenceScore).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                        {sortedScores.length > 0 && (
                                            <tfoot className="bg-gray-50">
                                                <tr>
                                                    <td colSpan={2} className={tdTotal}>
                                                        Total ({sortedScores.length} faculty)
                                                    </td>
                                                    <td className={tdTotal}>
                                                        {totalScore.toFixed(2)}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        )}
                                    </table>
                                </div>

                                <ViewAllFooter
                                    shown={visibleScores.length}
                                    total={sortedScores.length}
                                    expanded={showAllScores}
                                    onToggle={() => setShowAllScores(v => !v)}
                                    noun="faculty"
                                />
                            </ReportCard>

                            {/* NEEDS REVIEW (decisions here change the scores above) */}
                            <ReportCard
                                title="Authors needing review"
                                subtitle={
                                    review.loading || review.error
                                        ? undefined
                                        : `${review.data.length} author${review.data.length === 1 ? "" : "s"} waiting for a decision.`
                                }
                                loading={review.loading}
                                error={review.error}
                            >
                                {actionError && (
                                    <p className="px-5 py-3 text-sm text-red-600 border-b">{actionError}</p>
                                )}
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full min-w-max border-collapse">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className={th}>Author</th>
                                                <th className={th}>Author Type</th>
                                                <th className={th}>Why it was flagged</th>
                                                <th className={th}>Suggested Faculty</th>
                                                <th className={th}>Decision</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {review.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                                        Nothing to review.
                                                    </td>
                                                </tr>
                                            ) : (
                                                review.data.map(author => (
                                                    <tr key={author.authorId} className="hover:bg-gray-50">
                                                        <td className={td}>{author.displayName}</td>
                                                        <td className={td}>{author.authorType ?? "—"}</td>
                                                        <td className={`${td} max-w-[420px] whitespace-normal break-words`}>
                                                            {author.matchReason ?? "—"}
                                                        </td>
                                                        <td className={td}>{author.suggestedFacultyName ?? "—"}</td>
                                                        <td className={td}>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    disabled={busyId === author.authorId || author.suggestedFacultyId == null}
                                                                    onClick={() => handleDecision(author, true)}
                                                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    Confirm match
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    disabled={busyId === author.authorId}
                                                                    onClick={() => handleDecision(author, false)}
                                                                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    Not faculty
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </ReportCard>
                        </div>
                    )}

                    {/* ================= GRAPHS ================= */}
                    {activeTab === "graphs" && (
                        <div className="space-y-6">
                            <ReportCard
                                title="Student authors"
                                subtitle="Papers with at least one UG, PG or PhD student author."
                                loading={counts.loading}
                                error={counts.error}
                            >
                                <CountTable data={studentPieData} />
                                <PieChart data={studentPieData} />
                            </ReportCard>
                        </div>
                    )}

                    {/* ================= CONFERENCE STATISTICS ================= */}
                    {activeTab === "stats" && (
                        <ReportCard
                            title="Conference statistics"
                            subtitle="Number of conference papers, year by year."
                        >
                            <p className="px-5 py-10 text-center text-gray-500">
                                Conference statistics are not available yet.
                            </p>
                        </ReportCard>
                    )}
                </div>

            </div>
        </div>
    );
}