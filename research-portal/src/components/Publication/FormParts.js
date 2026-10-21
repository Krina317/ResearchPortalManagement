import { X, Plus, Trash2, ArrowUp, ArrowDown, Loader2 } from "lucide-react";

export const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";

/* The server sends plain text or JSON; pull out a readable message. */
export function readError(err) {
    const raw = err?.message ?? "";
    try {
        const parsed = JSON.parse(raw);
        return parsed.message || parsed.error || raw;
    } catch {
        return raw || "Could not save the paper.";
    }
}

/* Keeps the current value selectable even if it isn't in the options list. */
export function withCurrent(list, current) {
    const base = list ?? [];
    return current && !base.includes(current) ? [...base, current] : base;
}

/* Author names of a record, sorted by position. */
export function authorNamesOf(record) {
    if (!Array.isArray(record?.authors)) return [""];
    const names = [...record.authors]
        .sort((a, b) => Number(a.authorPosition) - Number(b.authorPosition))
        .map(a => a.displayName ?? a.author?.displayName ?? "")
        .filter(Boolean);
    return names.length ? names : [""];
}

export function Field({ label, required, children, className = "" }) {
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

export function AuthorListField({ authors, onChange }) {
    function setAuthor(index, value) {
        onChange(authors.map((a, i) => (i === index ? value : a)));
    }

    function move(index, delta) {
        const target = index + delta;
        if (target < 0 || target >= authors.length) return;
        const next = [...authors];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
    }

    return (
        <div>
            <span className="block text-sm font-medium text-gray-700">Authors</span>
            <p className="text-xs text-gray-500 mb-2">
                One name per box, in publication order. Don't put commas inside a name.
            </p>

            <div className="space-y-2">
                {authors.map((author, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <span className="w-6 text-sm text-gray-500 text-right">{index + 1}</span>
                        <input
                            value={author}
                            onChange={e => setAuthor(index, e.target.value)}
                            placeholder="Author name"
                            className={inputClass}
                        />
                        <button
                            type="button"
                            onClick={() => move(index, -1)}
                            disabled={index === 0}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                            aria-label="Move author up"
                        >
                            <ArrowUp size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => move(index, 1)}
                            disabled={index === authors.length - 1}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                            aria-label="Move author down"
                        >
                            <ArrowDown size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange(authors.filter((_, i) => i !== index))}
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
                onClick={() => onChange([...authors, ""])}
                className="mt-3 flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800"
            >
                <Plus size={16} />
                Add author
            </button>
        </div>
    );
}

export function ModalShell({ title, onClose, onSubmit, submitLabel, saving, error, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-8">

                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
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
                    {children}

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
                        onClick={onSubmit}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 disabled:opacity-50"
                    >
                        {saving && <Loader2 size={16} className="animate-spin" />}
                        {submitLabel}
                    </button>
                </div>

            </div>
        </div>
    );
}