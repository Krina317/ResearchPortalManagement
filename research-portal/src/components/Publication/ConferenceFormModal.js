import { useState } from "react";
import { createConference, updateConference } from "../../api/conferenceApi";
import {
    Field,
    inputClass,
    readError,
    withCurrent,
    authorNamesOf,
    AuthorListField,
    ModalShell
} from "./FormParts";

function buildInitialState(record) {
    return {
        sourceId: record?.sourceId ?? "",
        conferenceName: record?.conferenceName ?? "",
        conferenceType: record?.conferenceType ?? "",
        paperTitle: record?.paperTitle ?? "",
        fromDate: record?.fromDate ?? "",
        toDate: record?.toDate ?? "",
        instituteName: record?.instituteName ?? "",
        deptCode: record?.deptCode ?? "",
        authors: authorNamesOf(record)
    };
}

export default function ConferenceFormModal({ mode, record, options, onClose, onSaved }) {
    const isEdit = mode === "edit";

    const [form, setForm] = useState(() => buildInitialState(record));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    function set(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    const conferenceTypes = withCurrent(options?.conferenceTypes, form.conferenceType);
    const institutes = withCurrent(options?.institutes, form.instituteName);
    // conference departments are plain codes, e.g. "CE"
    const departments = withCurrent(
        (options?.departments ?? []).map(d => (typeof d === "string" ? d : d.value)),
        form.deptCode
    );

    async function handleSubmit() {
        setError("");

        const required = [
            ["sourceId", "Source ID"],
            ["conferenceName", "Conference name"],
            ["conferenceType", "Conference type"],
            ["paperTitle", "Paper title"],
            ["instituteName", "Institute"],
            ["deptCode", "Department"]
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

        if (form.fromDate && form.toDate && form.toDate < form.fromDate) {
            setError("To date cannot be before from date.");
            return;
        }

        const text = key => String(form[key] ?? "").trim();

        const payload = {
            sourceId: Number(form.sourceId),
            conferenceName: text("conferenceName"),
            conferenceType: text("conferenceType"),
            paperTitle: text("paperTitle"),
            fromDate: form.fromDate || null,
            toDate: form.toDate || null,
            instituteName: text("instituteName"),
            deptCode: text("deptCode"),
            authors: form.authors.map(a => a.trim()).filter(Boolean)
        };

        setSaving(true);

        try {
            if (isEdit) {
                await updateConference(record.id, payload);
            } else {
                await createConference(payload);
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
            title={isEdit ? "Edit conference paper" : "Add conference paper"}
            submitLabel={isEdit ? "Save changes" : "Add paper"}
            onClose={onClose}
            onSubmit={handleSubmit}
            saving={saving}
            error={error}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <Field label="Paper title" required className="sm:col-span-2">
                    <textarea
                        rows={2}
                        value={form.paperTitle}
                        onChange={e => set("paperTitle", e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <Field label="Conference name" required>
                    <input
                        value={form.conferenceName}
                        onChange={e => set("conferenceName", e.target.value)}
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

                <Field label="Conference type" required>
                    <input
                        list="conference-type-options"
                        value={form.conferenceType}
                        onChange={e => set("conferenceType", e.target.value)}
                        className={inputClass}
                    />
                    <datalist id="conference-type-options">
                        {conferenceTypes.map(v => <option key={v} value={v} />)}
                    </datalist>
                </Field>

                <Field label="Institute" required>
                    <input
                        list="conference-institute-options"
                        value={form.instituteName}
                        onChange={e => set("instituteName", e.target.value)}
                        className={inputClass}
                    />
                    <datalist id="conference-institute-options">
                        {institutes.map(v => <option key={v} value={v} />)}
                    </datalist>
                </Field>

                <Field label="Department" required className="sm:col-span-2">
                    <select
                        value={form.deptCode}
                        onChange={e => set("deptCode", e.target.value)}
                        className={inputClass}
                    >
                        <option value="">Select a department</option>
                        {departments.map(v => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                </Field>

                <Field label="From date">
                    <input
                        type="date"
                        value={form.fromDate}
                        onChange={e => set("fromDate", e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <Field label="To date">
                    <input
                        type="date"
                        value={form.toDate}
                        onChange={e => set("toDate", e.target.value)}
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