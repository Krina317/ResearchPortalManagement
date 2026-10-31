import { useState, useMemo, Fragment } from "react";
import { Plus, X, ChevronDown, ChevronRight, Paperclip, IndianRupee, Briefcase, Wallet, Hourglass } from "lucide-react";

/* ---------- helpers ---------- */

// DEMO ASSUMPTION: year runs April to March. Change here once mam confirms.
const getYear = (dateStr) => {
  const d = new Date(dateStr);
  const start = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return `${start}-${String(start + 1).slice(2)}`;
};

const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const fmtDate = (s) =>
  s ? new Date(s).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-";

const TYPES = ["Consultancy", "Training", "Product Development"];
const STATUSES = ["Sanctioned", "Ongoing", "Completed"];

const statusStyle = {
  Sanctioned: "bg-amber-50 text-amber-700",
  Ongoing: "bg-blue-50 text-blue-700",
  Completed: "bg-emerald-50 text-emerald-700",
};

/* ---------- fake data ---------- */

const INITIAL_PROJECTS = [
  {
    id: 1, title: "Structural health monitoring of a bridge using IoT sensors", type: "Consultancy",
    agency: "Western Infra Pvt. Ltd.", faculty: "Dr. A. Shah", sanctionDate: "2025-05-12",
    sanctioned: 450000, startDate: "2025-06-01", endDate: "2026-03-31", status: "Completed",
  },
  {
    id: 2, title: "Workshop on Embedded Systems for industry engineers", type: "Training",
    agency: "Gujarat Power Corp.", faculty: "Dr. P. Trivedi", sanctionDate: "2025-08-20",
    sanctioned: 180000, startDate: "2025-09-10", endDate: "2025-09-14", status: "Completed",
  },
  {
    id: 3, title: "Predictive maintenance model for transformers", type: "Consultancy",
    agency: "Sigma Energy Ltd.", faculty: "Dr. J. Vyas", sanctionDate: "2026-01-15",
    sanctioned: 600000, startDate: "2026-02-01", endDate: "2027-01-31", status: "Ongoing",
  },
  {
    id: 4, title: "Prototype of low-cost water quality analyser", type: "Product Development",
    agency: "AquaNova Systems", faculty: "Dr. S. Joshi, Dr. R. Mehta", sanctionDate: "2026-06-03",
    sanctioned: 350000, startDate: "2026-07-01", endDate: "2027-03-31", status: "Ongoing",
  },
  {
    id: 5, title: "Energy audit of manufacturing plant", type: "Consultancy",
    agency: "Apex Polymers", faculty: "Dr. V. Patel", sanctionDate: "2026-09-10",
    sanctioned: 220000, startDate: "2026-10-01", endDate: "2026-12-31", status: "Sanctioned",
  },
];

const INITIAL_LEDGER = [
  { id: 1, projectId: 1, date: "2025-09-25", amount: 225000, voucher: "VCH/25-26/0142", proof: "invoice_bridge_1.pdf", note: "1st installment" },
  { id: 2, projectId: 1, date: "2026-04-18", amount: 225000, voucher: "VCH/26-27/0021", proof: "invoice_bridge_2.pdf", note: "Final installment" },
  { id: 3, projectId: 2, date: "2025-10-05", amount: 180000, voucher: "VCH/25-26/0177", proof: "receipt_workshop.pdf", note: "Full payment" },
  { id: 4, projectId: 3, date: "2026-02-20", amount: 200000, voucher: "VCH/25-26/0310", proof: "advance_sigma.pdf", note: "Advance" },
  { id: 5, projectId: 3, date: "2026-08-12", amount: 200000, voucher: "VCH/26-27/0098", proof: "milestone1_sigma.pdf", note: "Milestone 1" },
  { id: 6, projectId: 4, date: "2026-07-15", amount: 100000, voucher: "VCH/26-27/0064", proof: "advance_aquanova.pdf", note: "Advance" },
];

/* ---------- small UI pieces ---------- */

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-800 text-sm">{title}</p>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 text-gray-500">
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block mb-3">
      <span className="block text-xs font-medium text-gray-600 mb-1">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 bg-white";

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900 tracking-tight truncate">{value}</p>
      </div>
    </div>
  );
}

/* ---------- forms ---------- */

function ProjectForm({ onSave, onClose }) {
  const [f, setF] = useState({
    title: "", type: TYPES[0], agency: "", faculty: "", sanctionDate: "",
    sanctioned: "", startDate: "", endDate: "", status: "Sanctioned",
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.title && f.agency && f.faculty && f.sanctionDate && f.sanctioned;

  return (
    <Modal title="Add consultancy project" onClose={onClose}>
      <Field label="Project title">
        <input className={inputCls} value={f.title} onChange={set("title")} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Type">
          <select className={inputCls} value={f.type} onChange={set("type")}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select className={inputCls} value={f.status} onChange={set("status")}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Agency name">
        <input className={inputCls} value={f.agency} onChange={set("agency")} />
      </Field>
      <Field label="Faculty involved">
        <input className={inputCls} value={f.faculty} onChange={set("faculty")} placeholder="Comma separated if more than one" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Sanction date">
          <input type="date" className={inputCls} value={f.sanctionDate} onChange={set("sanctionDate")} />
        </Field>
        <Field label="Sanctioned amount (₹)">
          <input type="number" className={inputCls} value={f.sanctioned} onChange={set("sanctioned")} />
        </Field>
        <Field label="Start date">
          <input type="date" className={inputCls} value={f.startDate} onChange={set("startDate")} />
        </Field>
        <Field label="End date">
          <input type="date" className={inputCls} value={f.endDate} onChange={set("endDate")} />
        </Field>
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <button onClick={onClose} className="px-4 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100">Cancel</button>
        <button
          disabled={!valid}
          onClick={() => onSave({ ...f, sanctioned: Number(f.sanctioned) })}
          className="px-4 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40"
        >
          Save project
        </button>
      </div>
    </Modal>
  );
}

function PaymentForm({ projects, defaultProjectId, onSave, onClose }) {
  const [f, setF] = useState({
    projectId: defaultProjectId || projects[0]?.id, date: "", amount: "", voucher: "", note: "", proof: "",
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.projectId && f.date && f.amount && f.voucher;

  return (
    <Modal title="Add ledger entry (payment received)" onClose={onClose}>
      <Field label="Project">
        <select className={inputCls} value={f.projectId} onChange={set("projectId")}>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date received">
          <input type="date" className={inputCls} value={f.date} onChange={set("date")} />
        </Field>
        <Field label="Amount (₹)">
          <input type="number" className={inputCls} value={f.amount} onChange={set("amount")} />
        </Field>
      </div>
      {f.date && (
        <p className="text-xs text-gray-500 -mt-1 mb-3">
          This will be counted in <span className="font-medium text-emerald-700">AY {getYear(f.date)}</span>
        </p>
      )}
      <Field label="Voucher reference">
        <input className={inputCls} value={f.voucher} onChange={set("voucher")} placeholder="e.g. VCH/26-27/0123" />
      </Field>
      <Field label="Note (optional)">
        <input className={inputCls} value={f.note} onChange={set("note")} placeholder="e.g. 1st installment" />
      </Field>
      <Field label="Proof for this transaction">
        <input
          type="file"
          className="block w-full text-sm text-gray-600 file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-emerald-50 file:text-emerald-700"
          onChange={(e) => setF({ ...f, proof: e.target.files[0]?.name || "" })}
        />
      </Field>
      <div className="flex justify-end gap-2 mt-2">
        <button onClick={onClose} className="px-4 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100">Cancel</button>
        <button
          disabled={!valid}
          onClick={() => onSave({ ...f, projectId: Number(f.projectId), amount: Number(f.amount) })}
          className="px-4 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40"
        >
          Save entry
        </button>
      </div>
    </Modal>
  );
}

/* ---------- main page ---------- */

export default function ConsultancyPage() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [ledger, setLedger] = useState(INITIAL_LEDGER);
  const [tab, setTab] = useState("projects");
  const [expanded, setExpanded] = useState(null);
  const [showProject, setShowProject] = useState(false);
  const [paymentFor, setPaymentFor] = useState(null); // null = closed, 0 = open without preselect, id = preselect

  const years = useMemo(() => {
    const set = new Set([getYear("2025-06-01")]);
    ledger.forEach((l) => set.add(getYear(l.date)));
    projects.forEach((p) => set.add(getYear(p.sanctionDate)));
    return [...set].sort().reverse();
  }, [ledger, projects]);

  const [year, setYear] = useState(years[0]);

  const receivedTotal = (pid) => ledger.filter((l) => l.projectId === pid).reduce((s, l) => s + l.amount, 0);
  const receivedInYear = (pid) =>
    ledger.filter((l) => l.projectId === pid && getYear(l.date) === year).reduce((s, l) => s + l.amount, 0);

  // A project shows in a year if money came in that year, or it is still open (carry-over)
  const visibleProjects = projects.filter(
    (p) => receivedInYear(p.id) > 0 || p.status !== "Completed" && getYear(p.sanctionDate) <= year
  );
  const yearLedger = ledger.filter((l) => getYear(l.date) === year).sort((a, b) => b.date.localeCompare(a.date));

  const totalSanctioned = visibleProjects.reduce((s, p) => s + p.sanctioned, 0);
  const totalReceivedYear = yearLedger.reduce((s, l) => s + l.amount, 0);
  const totalPending = visibleProjects.reduce((s, p) => s + Math.max(p.sanctioned - receivedTotal(p.id), 0), 0);

  const addProject = (p) => {
    setProjects([...projects, { ...p, id: Date.now() }]);
    setShowProject(false);
  };
  const addPayment = (l) => {
    setLedger([...ledger, { ...l, id: Date.now() }]);
    setPaymentFor(null);
  };

  const projectName = (id) => projects.find((p) => p.id === id)?.title || "";

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">Academic year</p>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-white font-medium text-gray-800"
          >
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPaymentFor(0)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm rounded-md border border-emerald-600 text-emerald-700 hover:bg-emerald-50"
          >
            <Plus size={15} /> Add ledger entry
          </button>
          <button
            onClick={() => setShowProject(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Plus size={15} /> Add project
          </button>
        </div>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Briefcase} label={`Projects in AY ${year}`} value={visibleProjects.length} />
        <StatCard icon={IndianRupee} label="Total sanctioned" value={inr(totalSanctioned)} />
        <StatCard icon={Wallet} label={`Received in AY ${year}`} value={inr(totalReceivedYear)} />
        <StatCard icon={Hourglass} label="Pending balance" value={inr(totalPending)} />
      </div>

      {/* tabs */}
      <div className="border-b border-gray-200 flex gap-6">
        {[
          ["projects", "Projects"],
          ["ledger", "Ledger"],
          ["report", "Report preview"],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`pb-2.5 text-sm font-medium -mb-px border-b-2 transition-colors ${
              tab === k ? "border-emerald-600 text-emerald-700" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* PROJECTS TAB */}
      {tab === "projects" && (
        <div className="bg-white border border-gray-100 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="w-8"></th>
                <th className="text-left px-3 py-3">Project</th>
                <th className="text-left px-3 py-3">Agency</th>
                <th className="text-left px-3 py-3">Faculty</th>
                <th className="text-right px-3 py-3">Sanctioned</th>
                <th className="text-right px-3 py-3">Received</th>
                <th className="text-right px-3 py-3">Pending</th>
                <th className="text-left px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleProjects.map((p) => {
                const rec = receivedTotal(p.id);
                const open = expanded === p.id;
                const entries = ledger.filter((l) => l.projectId === p.id).sort((a, b) => a.date.localeCompare(b.date));
                return (
                  <Fragment key={p.id}>
                    <tr
                      key={p.id}
                      onClick={() => setExpanded(open ? null : p.id)}
                      className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="pl-3 text-gray-400">{open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</td>
                      <td className="px-3 py-3 max-w-xs">
                        <p className="font-medium text-gray-800">{p.title}</p>
                        <p className="text-xs text-gray-500">
                          {p.type} · {fmtDate(p.startDate)} to {fmtDate(p.endDate)}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-gray-700">{p.agency}</td>
                      <td className="px-3 py-3 text-gray-700">{p.faculty}</td>
                      <td className="px-3 py-3 text-right text-gray-800">{inr(p.sanctioned)}</td>
                      <td className="px-3 py-3 text-right text-emerald-700 font-medium">{inr(rec)}</td>
                      <td className="px-3 py-3 text-right text-gray-800">{inr(Math.max(p.sanctioned - rec, 0))}</td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[p.status]}`}>{p.status}</span>
                      </td>
                    </tr>
                    {open && (
                      <tr key={p.id + "-detail"} className="bg-gray-50/60">
                        <td></td>
                        <td colSpan={7} className="px-3 py-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                              Ledger for this project
                            </p>
                            <button
                              onClick={(e) => { e.stopPropagation(); setPaymentFor(p.id); }}
                              className="text-xs text-emerald-700 font-medium hover:underline flex items-center gap-1"
                            >
                              <Plus size={13} /> Add entry
                            </button>
                          </div>
                          {entries.length === 0 ? (
                            <p className="text-xs text-gray-500">No payments received yet.</p>
                          ) : (
                            <table className="w-full text-xs">
                              <tbody>
                                {entries.map((l) => (
                                  <tr key={l.id} className="border-t border-gray-200">
                                    <td className="py-1.5 text-gray-700">{fmtDate(l.date)}</td>
                                    <td className="py-1.5 text-gray-500">AY {getYear(l.date)}</td>
                                    <td className="py-1.5 text-gray-700">{l.voucher}</td>
                                    <td className="py-1.5 text-gray-500">{l.note}</td>
                                    <td className="py-1.5 text-gray-500">
                                      {l.proof && <span className="inline-flex items-center gap-1"><Paperclip size={12} />{l.proof}</span>}
                                    </td>
                                    <td className="py-1.5 text-right font-medium text-gray-800">{inr(l.amount)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {visibleProjects.length === 0 && (
                <tr><td colSpan={8} className="text-center text-gray-500 py-10">No projects for this year.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* LEDGER TAB */}
      {tab === "ledger" && (
        <div className="bg-white border border-gray-100 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Project</th>
                <th className="text-left px-4 py-3">Voucher ref</th>
                <th className="text-left px-4 py-3">Note</th>
                <th className="text-left px-4 py-3">Proof</th>
                <th className="text-right px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {yearLedger.map((l) => (
                <tr key={l.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{fmtDate(l.date)}</td>
                  <td className="px-4 py-3 text-gray-800 max-w-xs">{projectName(l.projectId)}</td>
                  <td className="px-4 py-3 text-gray-700">{l.voucher}</td>
                  <td className="px-4 py-3 text-gray-500">{l.note}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {l.proof && <span className="inline-flex items-center gap-1"><Paperclip size={13} />{l.proof}</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">{inr(l.amount)}</td>
                </tr>
              ))}
              {yearLedger.length === 0 && (
                <tr><td colSpan={6} className="text-center text-gray-500 py-10">No transactions in this year.</td></tr>
              )}
            </tbody>
            {yearLedger.length > 0 && (
              <tfoot>
                <tr className="border-t border-gray-200 bg-gray-50">
                  <td colSpan={5} className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total for AY {year}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-700">{inr(totalReceivedYear)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}

      {/* REPORT PREVIEW TAB */}
      {tab === "report" && (
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-sm font-semibold text-gray-800">Consultancy Executive Summary Report: AY {year}</p>
          <p className="text-xs text-gray-500 mb-4">
            Generated automatically from the projects and ledger. Nothing here is typed by hand.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-gray-50 text-gray-600 text-xs">
                <tr>
                  <th className="border border-gray-200 px-3 py-2 text-left">SN</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Faculty involved</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Title</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">For whom</th>
                  <th className="border border-gray-200 px-3 py-2 text-right">Amount received in year</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleProjects.map((p, i) => (
                  <tr key={p.id}>
                    <td className="border border-gray-200 px-3 py-2">{i + 1}</td>
                    <td className="border border-gray-200 px-3 py-2">{p.faculty}</td>
                    <td className="border border-gray-200 px-3 py-2">{p.title}</td>
                    <td className="border border-gray-200 px-3 py-2">{p.agency}</td>
                    <td className="border border-gray-200 px-3 py-2 text-right">{inr(receivedInYear(p.id))}</td>
                    <td className="border border-gray-200 px-3 py-2">{p.status}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-semibold">
                  <td colSpan={4} className="border border-gray-200 px-3 py-2 text-right">Total</td>
                  <td className="border border-gray-200 px-3 py-2 text-right">{inr(totalReceivedYear)}</td>
                  <td className="border border-gray-200 px-3 py-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {showProject && <ProjectForm onSave={addProject} onClose={() => setShowProject(false)} />}
      {paymentFor !== null && (
        <PaymentForm
          projects={projects}
          defaultProjectId={paymentFor || undefined}
          onSave={addPayment}
          onClose={() => setPaymentFor(null)}
        />
      )}
    </div>
  );
}