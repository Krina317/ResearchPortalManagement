export default function DateFilter() {

    return (

        <div className="bg-white border border-gray-200 rounded-xl p-6">


            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                {/* From Date */}

                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                        From Date

                    </label>

                    <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />

                </div>

                {/* To Date */}

                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                        To Date

                    </label>

                    <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />

                </div>

                {/* Latest Upload */}

                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                        Uploaded Batch

                    </label>

                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">

                        <option>All Uploads</option>

                        <option>Latest Upload</option>

                    </select>

                </div>

                {/* Academic */}

                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                        Academic Year

                        <span className="text-xs text-gray-400 ml-2">

                            (July - June)

                        </span>

                    </label>

                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">

                        <option>All</option>

                        <option>2025-2026</option>

                        <option>2024-2025</option>

                        <option>2023-2024</option>

                        <option>2022-2023</option>

                        <option>2021-2022</option>

                        <option>2020-2021</option>

                    </select>

                </div>

                {/* Financial */}

                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                        Financial Year

                        <span className="text-xs text-gray-400 ml-2">

                            (April - March)

                        </span>

                    </label>

                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">

                        <option>All</option>

                        <option>2025-2026</option>

                        <option>2024-2025</option>

                        <option>2023-2024</option>

                        <option>2022-2023</option>

                        <option>2021-2022</option>

                        <option>2020-2021</option>

                    </select>

                </div>

                {/* Calendar */}

                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                        Calendar Year

                        <span className="text-xs text-gray-400 ml-2">

                            (January - December)

                        </span>

                    </label>

                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">

                        <option>All</option>

                        <option>2025</option>

                        <option>2024</option>

                        <option>2023</option>

                        <option>2022</option>

                        <option>2021</option>

                        <option>2020</option>

                    </select>

                </div>

            </div>

        </div>

    );

}