export default function DateFilter({ fromDate, toDate, academicYear, financialYear, calendarYear, onChange }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => onChange("fromDate", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => onChange("toDate", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Uploaded Batch</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
                        <option>All Uploads</option>
                        <option>Latest Upload</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Academic Year <span className="text-xs text-gray-400 ml-2">(July - June)</span>
                    </label>
                    <select
                        value={academicYear}
                        onChange={(e) => onChange("academicYear", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                    >
                        <option value="">All</option>
                        <option value="2025">2025-2026</option>
                        <option value="2024">2024-2025</option>
                        <option value="2023">2023-2024</option>
                        <option value="2022">2022-2023</option>
                        <option value="2021">2021-2022</option>
                        <option value="2020">2020-2021</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Financial Year <span className="text-xs text-gray-400 ml-2">(April - March)</span>
                    </label>
                    <select
                        value={financialYear}
                        onChange={(e) => onChange("financialYear", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                    >
                        <option value="">All</option>
                        <option value="2025">2025-2026</option>
                        <option value="2024">2024-2025</option>
                        <option value="2023">2023-2024</option>
                        <option value="2022">2022-2023</option>
                        <option value="2021">2021-2022</option>
                        <option value="2020">2020-2021</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Calendar Year <span className="text-xs text-gray-400 ml-2">(January - December)</span>
                    </label>
                    <select
                        value={calendarYear}
                        onChange={(e) => onChange("calendarYear", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                    >
                        <option value="">All</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                    </select>
                </div>

            </div>
        </div>
    );
}