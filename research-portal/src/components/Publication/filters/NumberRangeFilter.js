export default function NumberRangeFilter({
    label,
    fromValue,
    toValue,
    onFromChange,
    onToChange
}) {

    return (
        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <div className="grid grid-cols-2 gap-3">

                <input
                    type="number"
                    step="any"
                    value={fromValue ?? ""}
                    onChange={(e) =>
                        onFromChange(e.target.value)
                    }
                    placeholder="From"
                    className="
                        w-full
                        border border-gray-300
                        rounded-lg
                        px-3 py-2
                        text-sm
                        focus:ring-2
                        focus:ring-emerald-500
                        outline-none
                    "
                />

                <input
                    type="number"
                    step="any"
                    value={toValue ?? ""}
                    onChange={(e) =>
                        onToChange(e.target.value)
                    }
                    placeholder="To"
                    className="
                        w-full
                        border border-gray-300
                        rounded-lg
                        px-3 py-2
                        text-sm
                        focus:ring-2
                        focus:ring-emerald-500
                        outline-none
                    "
                />

            </div>

        </div>
    );
}