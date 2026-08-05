import DepartmentFilter from "./ConferenceFilter/DepartmentFilter";
import AuthorFilter from "./ConferenceFilter/AuthorFilter";
import DateFilter from "./ConferenceFilter/DateFilter";

export default function ConferenceFilter() {
    return (
        <div className="space-y-6 mb-6">
            {/* Conference Filters */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Conference Name
                        </label>
                        <input
                            type="text"
                            placeholder="Conference Name"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Paper Title
                        </label>
                        <input
                            type="text"
                            placeholder="Paper Title"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Conference Type
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                        >
                            <option>All</option>
                            <option>International</option>
                            <option>National</option>

                        </select>
                    </div>
                    <DepartmentFilter />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Institute
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                        >
                            <option>All</option>
                        </select>
                    </div>
                </div>
            </div>
            <AuthorFilter />
            <DateFilter />
            {/* Buttons */}
            <div className="flex justify-end gap-3">
                <button
                    className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                    Reset
                </button>
                <button
                    className="px-5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
}