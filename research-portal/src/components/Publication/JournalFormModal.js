import { useState } from "react";
import { X, Plus, Trash2, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { createJournal, updateJournal } from "../../api/journalApi";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";

/* "Scopus,Web of Science," -> ["Scopus", "Web of Science"] */
function parseIndexIn(value) {
    if (!value) return [];
    return value.split(",").map(v => v.trim()).filter(Boolean);
}

/* ["Scopus", "Web of Science"] -> "Scopus,Web of Science," (same format as the existing data) */
function joinIndexIn(values) {
    return values.map(v => `${v},`).join("");
}

function buildInitialState(record) {
    const authors = Array.isArray(record?.authors)
        ? [...record.authors]
            .sort((a, b) => Number(a.authorPosition) - Number(b.authorPosition))
            .map(a => a.displayName ?? a.author?.displayName ?? "")
            .filter(Boolean)
        : [];

    return {
        sourceId: record?.sourceId ?? "",
        paperTitle: record?.paperTitle ?? "",
        journalName: record?.journalName ?? "",
        journalType: record?.journalType ?? "",
        instituteName: record?.instituteName ?? "",
        deptName: record?.deptName ?? "",
        impactFactorClarivate: record?.impactFactorClarivate ?? "",
        impactFactorJournal: record?.impactFactorJournal ?? "",
        yearOfPublication: record?.yearOfPublication ?? "",
        monthOfPublication: record?.monthOfPublication ?? "",
        indexIn: parseIndexIn(record?.indexIn),
        issnNo: record?.issnNo ?? "",
        volumeNo: record?.volumeNo ?? "",
        issueNo: record?.issueNo ?? "",
        pageNo: record?.pageNo ?? "",
        websiteJournalLink: record?.websiteJournalLink ?? "",
        articleLink: record?.articleLink ?? "",
        doiNumber: record?.doiNumber ?? "",
        downloadFileLink: record?.downloadFileLink ?? "",
        authors: authors.length ? authors : [""]
    };
}

/* The server sends back plain text or JSON; pull out a readable message. */
function readError(err) {
    const raw = err?.message ?? "";
    try {
        const parsed = JSON.parse(raw);
        return parsed.message || parsed.error || raw;
    } catch {
        return raw || "Could not save the paper.";
    }
}

function Field({ label, required, children, className = "" }) {
    return (
        <label className={`block ${className}`}>
            <span className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500"> *</span>}
            </span>
            {children}
        </label>
    );
}

export default function JournalFormModal({ mode, record, options, onClose, onSaved }) {
    const isEdit = mode === "edit";

    const [form, setForm] = useState(() => buildInitialState(record));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    function set(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    /* Make sure the current value is always selectable, even if it isn't in the options. */
    function withCurrent(list, current) {
        const base = list ?? [];
        return current && !base.includes(current) ? [...base, current] : base;
    }

    const journalTypes = withCurrent(options?.journalTypes, form.journalType);
    const institutes = withCurrent(options?.institutes, form.instituteName);
    const departments = withCurrent(options?.departments, form.deptName);

    const indexOptions = [
        ...(options?.indexIn ?? []),
        ...form.indexIn.filter(v => !(options?.indexIn ?? []).includes(v))
    ];

    function toggleIndex(value) {
        setForm(prev => ({
            ...prev,
            indexIn: prev.indexIn.includes(value)
                ? prev.indexIn.filter(v => v !== value)
                : [...prev.indexIn, value]
        }));
    }

    function setAuthor(index, value) {
        setForm(prev => ({
            ...prev,
            authors: prev.authors.map((a, i) => (i === index ? value : a))
        }));
    }

    function addAuthor() {
        setForm(prev => ({ ...prev, authors: [...prev.authors, ""] }));
    }

    function removeAuthor(index) {
        setForm(prev => ({
            ...prev,
            authors: prev.authors.filter((_, i) => i !== index)
        }));
    }

    function moveAuthor(index, delta) {
        setForm(prev => {
            const target = index + delta;
            if (target < 0 || target >= prev.authors.length) return prev;
            const next = [...prev.authors];
            [next[index], next[target]] = [next[target], next[index]];
            return { ...prev, authors: next };
        });
    }

    async function handleSubmit() {
        setError("");

        const required = [
            ["sourceId", "Source ID"],
            ["paperTitle", "Paper title"],
            ["journalName", "Journal name"],
            ["journalType", "Journal type"],
            ["instituteName", "Institute"],
            ["deptName", "Department"]
        ];

        for (const [key, label] of required) {
            if (String(form[key]).trim() === "") {
                setError(`${label} is required.`);
                return;
            }
        }

        if (Number.isNaN(Number(form.sourceId))) {
            setError("Source ID must be a number.");
            return;
        }

        if (form.yearOfPublication !== "" && Number.isNaN(Number(form.yearOfPublication))) {
            setError("Year must be a number.");
            return;
        }

        const text = key => String(form[key] ?? "").trim();

        /*
         * fileName is deliberately not sent: the list API doesn't return it,
         * and the backend keeps the existing value when it is missing.
         */
        const payload = {
            sourceId: Number(form.sourceId),
            paperTitle: text("paperTitle"),
            journalName: text("journalName"),
            journalType: text("journalType"),
            instituteName: text("instituteName"),
            deptName: text("deptName"),
            impactFactorClarivate: text("impactFactorClarivate"),
            impactFactorJournal: text("impactFactorJournal"),
            yearOfPublication:
                form.yearOfPublication === "" ? null : Number(form.yearOfPublication),
            monthOfPublication: text("monthOfPublication"),
            indexIn: joinIndexIn(form.indexIn),
            issnNo: text("issnNo"),
            volumeNo: text("volumeNo"),
            issueNo: text("issueNo"),
            pageNo: text("pageNo"),
            websiteJournalLink: text("websiteJournalLink"),
            articleLink: text("articleLink"),
            doiNumber: text("doiNumber"),
            downloadFileLink: text("downloadFileLink"),
            authors: form.authors.map(a => a.trim()).filter(Boolean)
        };

        setSaving(true);

        try {
            if (isEdit) {
                await updateJournal(record.id, payload);
            } else {
                await createJournal(payload);
            }
            onSaved();
        } catch (err) {
            console.error(err);
            setError(readError(err));
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-8">

                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {isEdit ? "Edit journal paper" : "Add journal paper"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-5">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <Field label="Paper title" required className="sm:col-span-2">
                            <textarea
                                rows={2}
                                value={form.paperTitle}
                                onChange={e => set("paperTitle", e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Journal name" required>
                            <input
                                value={form.journalName}
                                onChange={e => set("journalName", e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Source ID" required>
                            <input
                                type="number"
                                value={form.sourceId}
                                onChange={e => set("sourceId", e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Journal type" required>
                            <input
                                list="journal-type-options"
                                value={form.journalType}
                                onChange={e => set("journalType", e.target.value)}
                                className={inputClass}
                            />
                            <datalist id="journal-type-options">
                                {journalTypes.map(v => <option key={v} value={v} />)}
                            </datalist>
                        </Field>

                        <Field label="Institute" required>
                            <input
                                list="journal-institute-options"
                                value={form.instituteName}
                                onChange={e => set("instituteName", e.target.value)}
                                className={inputClass}
                            />
                            <datalist id="journal-institute-options">
                                {institutes.map(v => <option key={v} value={v} />)}
                            </datalist>
                        </Field>

                        <Field label="Department" required className="sm:col-span-2">
                            <select
                                value={form.deptName}
                                onChange={e => set("deptName", e.target.value)}
                                className={inputClass}
                            >
                                <option value="">Select a department</option>
                                {departments.map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Month of publication">
                            <select
                                value={form.monthOfPublication}
                                onChange={e => set("monthOfPublication", e.target.value)}
                                className={inputClass}
                            >
                                <option value="">—</option>
                                {MONTHS.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Year of publication">
                            <input
                                type="number"
                                value={form.yearOfPublication}
                                onChange={e => set("yearOfPublication", e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Impact factor (Clarivate)">
                            <input
                                value={form.impactFactorClarivate}
                                onChange={e => set("impactFactorClarivate", e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Impact factor (Journal)">
                            <input
                                value={form.impactFactorJournal}
                                onChange={e => set("impactFactorJournal", e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="ISSN no">
                            <input
                                value={form.issnNo}
                                onChange={e => set("issnNo", e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Volume no">
                            <input
                                value={form.volumeNo}
                                onChange={e => set("volumeNo", e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Issue no">
                            <input
                                value={form.issueNo}
                                onChange={e => set("issueNo", e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Page no">
                            <input
                                value={form.pageNo}
                                onChange={e => set("pageNo", e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                    </div>

                    <div>
                        <span className="block text-sm font-medium text-gray-700 mb-2">
                            Indexed in
                        </span>
                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                            {indexOptions.map(value => (
                                <label
                                    key={value}
                                    className="flex items-center gap-2 text-sm text-gray-700"
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.indexIn.includes(value)}
                                        onChange={() => toggleIndex(value)}
                                        className="accent-emerald-600"
                                    />
                                    {value}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">

                        <Field label="Journal website link">
                            <input
                                value={form.websiteJournalLink}
                                onChange={e => set("websiteJournalLink", e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Article link">
                            <input
                                value={form.articleLink}
                                onChange={e => set("articleLink", e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="DOI">
                            <input
                                value={form.doiNumber}
                                onChange={e => set("doiNumber", e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Download file link">
                            <input
                                value={form.downloadFileLink}
                                onChange={e => set("downloadFileLink", e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                    </div>

                    <div>
                        <span className="block text-sm font-medium text-gray-700">
                            Authors
                        </span>
                        <p className="text-xs text-gray-500 mb-2">
                            One name per box, in publication order. Don't put commas inside a name.
                        </p>

                        <div className="space-y-2">
                            {form.authors.map((author, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="w-6 text-sm text-gray-500 text-right">
                                        {index + 1}
                                    </span>
                                    <input
                                        value={author}
                                        onChange={e => setAuthor(index, e.target.value)}
                                        placeholder="Author name"
                                        className={inputClass}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => moveAuthor(index, -1)}
                                        disabled={index === 0}
                                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                                        aria-label="Move author up"
                                    >
                                        <ArrowUp size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveAuthor(index, 1)}
                                        disabled={index === form.authors.length - 1}
                                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                                        aria-label="Move author down"
                                    >
                                        <ArrowDown size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeAuthor(index)}
                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                                        aria-label="Remove author"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addAuthor}
                            className="mt-3 flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800"
                        >
                            <Plus size={16} />
                            Add author
                        </button>
                    </div>

                    {error && (
                        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 disabled:opacity-50"
                    >
                        {saving && <Loader2 size={16} className="animate-spin" />}
                        {isEdit ? "Save changes" : "Add paper"}
                    </button>
                </div>

            </div>
        </div>
    );
}