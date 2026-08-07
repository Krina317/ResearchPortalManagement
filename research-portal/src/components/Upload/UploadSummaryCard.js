export default function UploadSummaryCard({ result }){

    const savedCount = result.savedCount ?? 0;
    const duplicateCount = result.skippedDuplicateTitles?.length ?? 0;
    const departmentFilteredCount = result.skippedDepartmentRows?.length ?? 0;
    const failedCount = result.skippedErrorRows?.length ?? 0;
    const rowsRead = savedCount + duplicateCount + departmentFilteredCount + failedCount;

    return(

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">

            <h2 className="text-lg font-semibold mb-5">

                Upload Summary

            </h2>

            <div className="grid grid-cols-3 gap-5">

                <div>

                    <p className="text-sm text-gray-500">

                        Rows Read

                    </p>

                    <h3 className="text-2xl font-bold">

                        {rowsRead}

                    </h3>

                </div>

                <div>

                    <p className="text-sm text-gray-500">

                        Stored

                    </p>

                    <h3 className="text-2xl font-bold text-emerald-600">

                        {savedCount}

                    </h3>

                </div>

                <div>

                    <p className="text-sm text-gray-500">

                        Duplicate

                    </p>

                    <h3 className="text-2xl font-bold text-yellow-500">

                        {duplicateCount}

                    </h3>

                </div>

                <div>

                    <p className="text-sm text-gray-500">

                        Department Filtered

                    </p>

                    <h3 className="text-2xl font-bold text-orange-500">

                        {departmentFilteredCount}

                    </h3>

                </div>

                <div>

                    <p className="text-sm text-gray-500">

                        Failed

                    </p>

                    <h3 className="text-2xl font-bold text-red-500">

                        {failedCount}

                    </h3>

                </div>

            </div>

            {duplicateCount > 0 && (

                <details className="mt-5 text-sm">

                    <summary className="cursor-pointer text-gray-600 font-medium">

                        View {duplicateCount} duplicate title(s)

                    </summary>

                    <ul className="mt-2 list-disc pl-5 text-gray-500 space-y-1 max-h-48 overflow-y-auto">

                        {result.skippedDuplicateTitles.map((title, i) => (

                            <li key={i}>{title}</li>

                        ))}

                    </ul>

                </details>

            )}

            {departmentFilteredCount > 0 && (

                <details className="mt-3 text-sm">

                    <summary className="cursor-pointer text-gray-600 font-medium">

                        View {departmentFilteredCount} department-filtered row(s)

                    </summary>

                    <ul className="mt-2 list-disc pl-5 text-gray-500 space-y-1 max-h-48 overflow-y-auto">

                        {result.skippedDepartmentRows.map((row, i) => (

                            <li key={i}>{row}</li>

                        ))}

                    </ul>

                </details>

            )}

        </div>

    );

}
