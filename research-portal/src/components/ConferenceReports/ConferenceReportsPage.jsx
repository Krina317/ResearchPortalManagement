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
    fromDate: "", toDate: ""
};

const STUDENT_TYPES = ["UG", "PG", "PHD"];

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

function ReportCard({ title, subtitle, loading, error, children }) {
    return (
        <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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

const th = "px-4 py-3 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap";
const td = "px-4 py-3 text-sm text-gray-700 border-b last:border-b-0";

export default function ConferenceReportsPage() {
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [applied, setApplied] = useState(EMPTY_FILTERS);

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
            scores.reload();
        } catch (err) {
            console.error(err);
            setActionError(`Could not save the decision for ${author.displayName}.`);
        } finally {
            setBusyId(null);
        }
    }

    const sortedScores = [...scores.data].sort(
        (a, b) => b.conferenceScore - a.conferenceScore
    );

    const countByType = Object.fromEntries(
        counts.data.map(c => [c.studentType, c.count])
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Conference Reports
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Faculty scores, student author counts and authors waiting for review.
                    </p>
                </div>

                <ReportFilterBar
                    mode="date"
                    filters={filters}
                    onChange={updateFilter}
                    onApply={() => setApplied(filters)}
                    onReset={resetFilters}
                />

                {/* 1. FACULTY SCORES */}
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
                                    sortedScores.map((row, index) => (
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
                        </table>
                    </div>
                </ReportCard>

                {/* 2. STUDENT TYPE COUNT */}
                <ReportCard
                    title="Student authors"
                    subtitle="Number of conference papers with at least one UG, PG or PhD student author."
                    loading={counts.loading}
                    error={counts.error}
                >
                    <div className="w-full overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    {STUDENT_TYPES.map(type => (
                                        <th key={type} className={th}>{type}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {STUDENT_TYPES.map(type => (
                                        <td key={type} className="px-4 py-4 text-lg font-semibold text-gray-800">
                                            {countByType[type] ?? 0}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </ReportCard>

                {/* 3. NEEDS REVIEW */}
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
        </div>
    );
}