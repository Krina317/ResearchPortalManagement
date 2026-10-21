function MetricLine({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-800">{value ?? "—"}</span>
    </div>
  );
}

function ScholarCell({ metrics }) {
  // Before the first refresh
  if (!metrics) {
    return (
      <div className="space-y-2">
        <MetricLine label="Citations" value={null} />
        <MetricLine label="h-index" value={null} />
        <MetricLine label="i10-index" value={null} />
      </div>
    );
  }

  if (metrics.status === "NO_PUBLIC_PROFILE") {
    return <div className="text-gray-400">Profile not public</div>;
  }

  if (metrics.status === "ERROR") {
    return (
      <div className="text-amber-600">
        Couldn't fetch metrics. Try again later.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <MetricLine label="Citations" value={metrics.citations} />
      <MetricLine label="h-index" value={metrics.hIndex} />
      <MetricLine label="i10-index" value={metrics.i10Index} />
    </div>
  );
}

export default function FacultyMetricsRow({ faculty, metrics }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
      {/* Faculty Name */}
      <td className="px-6 py-5 align-top">
        <div className="font-medium text-gray-800">{faculty.name}</div>
      </td>

      {/* Google Scholar */}
      <td className="px-6 py-5 align-top">
        <ScholarCell metrics={metrics} />
      </td>

      {/* Website 2 */}
      <td className="px-6 py-5 align-top">
        <div className="text-gray-400">Metrics not available</div>
      </td>

      {/* Website 3 */}
      <td className="px-6 py-5 align-top">
        <div className="text-gray-400">Metrics not available</div>
      </td>
    </tr>
  );
}