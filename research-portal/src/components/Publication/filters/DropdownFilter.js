export default function DropdownFilter({
    label,
    value,
    options = [],
    onChange,
    placeholder = "All"
}) {

    return (
        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <select
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="
                    w-full
                    border border-gray-300
                    rounded-lg
                    px-3 py-2
                    bg-white
                    text-sm
                    focus:ring-2
                    focus:ring-emerald-500
                    focus:border-emerald-500
                    outline-none
                "
            >

                <option value="">
                    {placeholder}
                </option>

                {options.map((option) => (

                    <option
                        key={option}
                        value={option}
                    >
                        {option}
                    </option>

                ))}

            </select>

        </div>
    );
}