import { useState } from "react";
import { createBookChapter, updateBookChapter } from "../../api/bookChapterApi";
import {
    Field,
    inputClass,
    readError,
    withCurrent,
    authorNamesOf,
    AuthorListField,
    ModalShell
} from "./FormParts";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function buildInitialState(record) {
    return {
        sourceId: record?.sourceId ?? "",
        bookTitle: record?.bookTitle ?? "",
        bookChapterTitle: record?.bookChapterTitle ?? "",
        nameOfBookPublisher: record?.nameOfBookPublisher ?? "",
        instituteName: record?.instituteName ?? "",
        deptName: record?.deptName ?? "",
        month: record?.month ?? "",
        year: record?.year ?? "",
        yearOfPublication: record?.yearOfPublication ?? "",
        isbnNo: record?.isbnNo ?? "",
        publicationType: record?.publicationType ?? "",
        publicationCity: record?.publicationCity ?? "",
        fileName: record?.fileName ?? "",
        authors: authorNamesOf(record)
    };
}

export default function BookChapterFormModal({ mode, record, options, onClose, onSaved }) {
    const isEdit = mode === "edit";

    const [form, setForm] = useState(() => buildInitialState(record));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    function set(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    const institutes = withCurrent(options?.institutes, form.instituteName);
    // the backend validates the department NAME, so use the label if options are {value, label}
    const departments = withCurrent(
        (options?.departments ?? []).map(d => (typeof d === "string" ? d : d.label)),
        form.deptName
    );

    async function handleSubmit() {
        setError("");

        const required = [
            ["sourceId", "Source ID"],
            ["bookTitle", "Book title"],
            ["bookChapterTitle", "Book chapter title"],
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

        if (form.year !== "" && Number.isNaN(Number(form.year))) {
            setError("Year must be a number.");
            return;
        }

        const text = key => String(form[key] ?? "").trim();

        /*
         * fileName IS sent back: the book chapter backend overwrites it
         * with whatever the request contains, so omitting it would erase it.
         */
        const payload = {
            sourceId: Number(form.sourceId),
            bookTitle: text("bookTitle"),
            bookChapterTitle: text("bookChapterTitle"),
            nameOfBookPublisher: text("nameOfBookPublisher"),
            instituteName: text("instituteName"),
            deptName: text("deptName"),
            month: form.month === "" ? null : Number(form.month),
            year: form.year === "" ? null : Number(form.year),
            yearOfPublication: text("yearOfPublication"),
            isbnNo: text("isbnNo"),
            publicationType: text("publicationType"),
            publicationCity: text("publicationCity"),
            fileName: text("fileName"),
            authors: form.authors.map(a => a.trim()).filter(Boolean)
        };

        setSaving(true);

        try {
            if (isEdit) {
                await updateBookChapter(record.id, payload);
            } else {
                await createBookChapter(payload);
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
        <ModalShell
            title={isEdit ? "Edit book chapter" : "Add book chapter"}
            submitLabel={isEdit ? "Save changes" : "Add chapter"}
            onClose={onClose}
            onSubmit={handleSubmit}
            saving={saving}
            error={error}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <Field label="Book chapter title" required className="sm:col-span-2">
                    <textarea
                        rows={2}
                        value={form.bookChapterTitle}
                        onChange={e => set("bookChapterTitle", e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <Field label="Book title" required>
                    <input
                        value={form.bookTitle}
                        onChange={e => set("bookTitle", e.target.value)}
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

                <Field label="Name of book publisher">
                    <input
                        value={form.nameOfBookPublisher}
                        onChange={e => set("nameOfBookPublisher", e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <Field label="Institute" required>
                    <input
                        list="bookchapter-institute-options"
                        value={form.instituteName}
                        onChange={e => set("instituteName", e.target.value)}
                        className={inputClass}
                    />
                    <datalist id="bookchapter-institute-options">
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

                <Field label="Month">
                    <select
                        value={form.month}
                        onChange={e => set("month", e.target.value)}
                        className={inputClass}
                    >
                        <option value="">—</option>
                        {MONTHS.map((m, i) => (
                            <option key={m} value={i + 1}>{m}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Year">
                    <input
                        type="number"
                        value={form.year}
                        onChange={e => set("year", e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <Field label="Year of publication">
                    <input
                        value={form.yearOfPublication}
                        onChange={e => set("yearOfPublication", e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <Field label="ISBN no">
                    <input
                        value={form.isbnNo}
                        onChange={e => set("isbnNo", e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <Field label="Publication type">
                    <input
                        value={form.publicationType}
                        onChange={e => set("publicationType", e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <Field label="Publication city">
                    <input
                        value={form.publicationCity}
                        onChange={e => set("publicationCity", e.target.value)}
                        className={inputClass}
                    />
                </Field>

            </div>

            <AuthorListField
                authors={form.authors}
                onChange={authors => set("authors", authors)}
            />
        </ModalShell>
    );
}