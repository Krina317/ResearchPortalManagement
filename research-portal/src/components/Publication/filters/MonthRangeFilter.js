export default function MonthRangeFilter({
    fromMonth,
    toMonth,
    fromYear,
    toYear,
    monthOptions = [],
    yearOptions = [],
    onChange
}) {
    return (
        <div>
            <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
            ">

                {/* FROM */}
                <div>
                    <label className="
                        block
                        text-sm
                        font-medium
                        text-gray-700
                        mb-2
                    ">
                        From
                    </label>

                    <div className="grid grid-cols-2 gap-3">

                        {/* FROM MONTH */}
                        <select
                            value={fromMonth ?? ""}
                            onChange={(e) =>
                                onChange(
                                    "fromMonth",
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                border border-gray-300
                                rounded-lg
                                px-3 py-2
                                bg-white
                                text-sm
                                focus:ring-2
                                focus:ring-emerald-500
                                outline-none
                            "
                        >
                            <option value="">
                                Month
                            </option>

                            {monthOptions.map((month) => (
                                <option
                                    key={month.value}
                                    value={month.value}
                                >
                                    {month.label}
                                </option>
                            ))}
                        </select>

                        {/* FROM YEAR */}
                        <select
                            value={fromYear ?? ""}
                            onChange={(e) =>
                                onChange(
                                    "fromYear",
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                border border-gray-300
                                rounded-lg
                                px-3 py-2
                                bg-white
                                text-sm
                                focus:ring-2
                                focus:ring-emerald-500
                                outline-none
                            "
                        >
                            <option value="">
                                Year
                            </option>

                            {yearOptions.map((item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </option>
                            ))}
                        </select>

                    </div>
                </div>


                {/* TO */}
                <div>
                    <label className="
                        block
                        text-sm
                        font-medium
                        text-gray-700
                        mb-2
                    ">
                        To
                    </label>

                    <div className="grid grid-cols-2 gap-3">

                        {/* TO MONTH */}
                        <select
                            value={toMonth ?? ""}
                            onChange={(e) =>
                                onChange(
                                    "toMonth",
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                border border-gray-300
                                rounded-lg
                                px-3 py-2
                                bg-white
                                text-sm
                                focus:ring-2
                                focus:ring-emerald-500
                                outline-none
                            "
                        >
                            <option value="">
                                Month
                            </option>

                            {monthOptions.map((month) => (
                                <option
                                    key={month.value}
                                    value={month.value}
                                >
                                    {month.label}
                                </option>
                            ))}
                        </select>

                        {/* TO YEAR */}
                        <select
                            value={toYear ?? ""}
                            onChange={(e) =>
                                onChange(
                                    "toYear",
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                border border-gray-300
                                rounded-lg
                                px-3 py-2
                                bg-white
                                text-sm
                                focus:ring-2
                                focus:ring-emerald-500
                                outline-none
                            "
                        >
                            <option value="">
                                Year
                            </option>

                            {yearOptions.map((item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </option>
                            ))}
                        </select>

                    </div>
                </div>

            </div>
        </div>
    );
}