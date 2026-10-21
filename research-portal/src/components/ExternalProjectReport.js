import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchExternalProjectReport } from "../api/externalReportApi";
import { buildReportGroups } from "./ExternalReportModel";
import { downloadPdf, downloadWord } from "./ExternalReportExport";
import "./ExternalProjectReport.css";

const ReportTable = ({ table }) => {
  const cols = table.head.length;
  return (
    <div className="erp-table-wrap">
      <table className="erp-table">
        <thead>
          {table.caption && (
            <tr>
              <th colSpan={cols} className="erp-caption">{table.caption}</th>
            </tr>
          )}
          <tr>
            {table.head.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>{cell}</td>
              ))}
            </tr>
          ))}
          {table.summary.map((s, i) => (
            <tr key={`s${i}`} className="erp-summary">
              <td colSpan={cols - 1}>{s.label}</td>
              <td>{s.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function ExternalProjectReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setReport(await fetchExternalProjectReport());
    } catch (e) {
      setError(e.message || "Failed to load report.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const groups = useMemo(() => (report ? buildReportGroups(report) : []), [report]);
  const cay = report?.currentAcademicYear ?? "";

  return (
    <div className="erp-page">
      <div className="erp-toolbar">
        <div>
          <h1>External Funded Projects Report</h1>
          <p>Current academic year: <b>{cay || "-"}</b> · all years available in the database</p>
        </div>
        <div className="erp-actions">
          <button className="erp-btn" onClick={load} disabled={loading}>Refresh</button>
          <button className="erp-btn" onClick={() => downloadWord(groups, cay)} disabled={!report}>
            Download Word
          </button>
          <button className="erp-btn erp-btn-primary" onClick={() => downloadPdf(groups, cay)} disabled={!report}>
            Download PDF
          </button>
        </div>
      </div>

      {loading && <p className="erp-note">Loading report…</p>}
      {error && <p className="erp-note erp-error">{error}</p>}

      {groups.map((g) => (
        <section key={g.id} className="erp-card">
          <h2>{g.heading}</h2>
          {g.tables.length === 0 ? (
            <p className="erp-note">No projects.</p>
          ) : (
            g.tables.map((t, i) => <ReportTable key={i} table={t} />)
          )}
        </section>
      ))}
    </div>
  );
}