export default function MonthRangeFilter({
    fromMonth,
    toMonth,
    year,
    monthOptions = [],
    yearOptions = [],
    onChange
}) {

    return (
        <div>

            <div className="
                grid
                grid-cols-1
                md:grid-cols-3
                gap-5
            ">

                {/* FROM MONTH */}

                <div>

                    <label className="
                        block
                        text-sm
                        font-medium
                        text-gray-700
                        mb-2
                    ">
                        From Month
                    </label>

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
                            All
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

                </div>


                {/* TO MONTH */}

                <div>

                    <label className="
                        block
                        text-sm
                        font-medium
                        text-gray-700
                        mb-2
                    ">
                        To Month
                    </label>

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
                            All
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

                </div>


                {/* YEAR */}

                <div>

                    <label className="
                        block
                        text-sm
                        font-medium
                        text-gray-700
                        mb-2
                    ">
                        Year
                    </label>

                    <select
                        value={year ?? ""}
                        onChange={(e) =>
                            onChange(
                                "year",
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
                            All
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
    );
}