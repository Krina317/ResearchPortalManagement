import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
    fetchFacultyScores,
    fetchStudentCounts,
    fetchReviewAuthors
} from "../../api/journalApi";

const STUDENT_TYPES = ["UG", "PG", "PHD"];

/* Loads one report and tracks its own loading / error state. */
function useReport(loader) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

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
    }, [loader]);

    return { data, loading, error };
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

export default function JournalReportsPage() {
    const scores = useReport(fetchFacultyScores);
    const counts = useReport(fetchStudentCounts);
    const review = useReport(fetchReviewAuthors);

    // highest score first
    const sortedScores = [...scores.data].sort(
        (a, b) => b.journalScore - a.journalScore
    );

    // always show UG, PG, PHD in that order, even if the API omits one
    const countByType = Object.fromEntries(
        counts.data.map(c => [c.studentType, c.count])
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Journal Reports
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Faculty scores, student author counts and authors waiting for review.
                    </p>
                </div>

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
                                                {Number(row.journalScore).toFixed(2)}
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
                    subtitle="Number of UG, PG and PhD student authors on journal papers."
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
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-max border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className={th}>Author</th>
                                    <th className={th}>Author Type</th>
                                    <th className={th}>Why it was flagged</th>
                                    <th className={th}>Suggested Faculty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {review.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
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
