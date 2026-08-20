export default function DateFilter({
    fromDate,
    toDate,
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

                {/* FROM DATE */}

                <div>

                    <label className="
                        block
                        text-sm
                        font-medium
                        text-gray-700
                        mb-2
                    ">
                        From Date
                    </label>

                    <input
                        type="date"
                        value={fromDate ?? ""}
                        onChange={(e) =>
                            onChange(
                                "fromDate",
                                e.target.value
                            )
                        }
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


                {/* TO DATE */}

                <div>

                    <label className="
                        block
                        text-sm
                        font-medium
                        text-gray-700
                        mb-2
                    ">
                        To Date
                    </label>

                    <input
                        type="date"
                        value={toDate ?? ""}
                        onChange={(e) =>
                            onChange(
                                "toDate",
                                e.target.value
                            )
                        }
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

        </div>
    );
}