export default function TextFilter({
    label,
    value,
    onChange,
    placeholder
}) {

    return (
        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <input
                type="text"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || `Search ${label}`}
                className="
                    w-full
                    border border-gray-300
                    rounded-lg
                    px-3 py-2
                    text-sm
                    bg-white
                    focus:ring-2
                    focus:ring-emerald-500
                    focus:border-emerald-500
                    outline-none
                "
            />

        </div>
    );
}