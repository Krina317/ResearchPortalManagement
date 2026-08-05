export default function UploadSummaryCard(){
    return(
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-5">
                Upload Summary
            </h2>
            <div className="grid grid-cols-3 gap-5">
                <div>
                    <p className="text-sm text-gray-500">
                        Rows Read
                    </p>
                    <h3 className="text-2xl font-bold">
                        214
                    </h3>
                </div>
                <div>
                    <p className="text-sm text-gray-500">
                        Stored
                    </p>
                    <h3 className="text-2xl font-bold text-emerald-600">
                        198
                    </h3>
                </div>
                <div>
                    <p className="text-sm text-gray-500">
                        Duplicate
                    </p>
                    <h3 className="text-2xl font-bold text-yellow-500">
                        8
                    </h3>
                </div>
                <div>
                    <p className="text-sm text-gray-500">
                        Department Filtered
                    </p>
                    <h3 className="text-2xl font-bold text-orange-500">
                        6
                    </h3>
                </div>
                <div>
                    <p className="text-sm text-gray-500">
                        Failed
                    </p>
                    <h3 className="text-2xl font-bold text-red-500">
                        2
                    </h3>
                </div>
            </div>
        </div>
    );
}