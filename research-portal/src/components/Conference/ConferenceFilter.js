import DepartmentFilter from "./ConferenceFilter/DepartmentFilter";
import AuthorFilter from "./ConferenceFilter/AuthorFilter";
import DateFilter from "./ConferenceFilter/DateFilter";

export default function ConferenceFilter({ filters, onFiltersChange, onApply, onReset, mergeAuthors, onMergeAuthorsChange }) {

    function updateField(field, value){
        onFiltersChange({ ...filters, [field]: value });
    }

    return (
        <div className="space-y-6 mb-6">

            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Conference Name
                        </label>
                        <input
                            type="text"
                            value={filters.conferenceName}
                            onChange={e => updateField("conferenceName", e.target.value)}
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
                            value={filters.paperTitle}
                            onChange={e => updateField("paperTitle", e.target.value)}
                            placeholder="Paper Title"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Conference Type
                        </label>
                        <select
                            value={filters.conferenceType}
                            onChange={e => updateField("conferenceType", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                        >
                            <option>All</option>
                            <option value="International">International</option>
                            <option value="National">National</option>
                        </select>
                    </div>

                    <DepartmentFilter
                        selectedDepartments={filters.departments}
                        onChange={(departments) => updateField("departments", departments)}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Institute
                        </label>
                        <select
                            value={filters.instituteName}
                            onChange={e => updateField("instituteName", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                        >
                            <option>All</option>
                            <option>INSTITUTE OF TECHNOLOGY</option>
                        </select>
                    </div>

                </div>
            </div>

            <AuthorFilter
                authorName={filters.authorName}
                selectedPositions={filters.authorPositions}
                onAuthorNameChange={(v) => updateField("authorName", v)}
                onPositionsChange={(v) => updateField("authorPositions", v)}
                mergeAuthors={mergeAuthors}
                onMergeAuthorsChange={onMergeAuthorsChange}
            />

            <DateFilter
                fromDate={filters.fromDate}
                toDate={filters.toDate}
                academicYear={filters.academicYear}
                financialYear={filters.financialYear}
                calendarYear={filters.calendarYear}
                onChange={updateField}
            />

            <div className="flex justify-end gap-3">
                <button
                    onClick={onReset}
                    className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                    Reset
                </button>
                <button
                    onClick={onApply}
                    className="px-5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                    Apply Filters
                </button>
            </div>

        </div>
    );
}