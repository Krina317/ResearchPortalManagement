export default function UploadPreviewTable(){
    const columns=[
        "ID",
        "Conference",
        "Paper Title",
        "Department",
        "Institute"
    ];
    return(
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="px-5 py-4 border-b flex justify-between">
                <div>
                    <h2 className="font-semibold">
                        Upload Preview
                    </h2>
                    <p className="text-sm text-gray-500">
                        Showing 25 of 214 rows
                    </p>
                </div>
            </div>
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map(col=>
                            <th
                                key={col}
                                className="px-4 py-3 text-left"
                            >
                                {col}
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(10)].map((_,i)=>
                        <tr
                            key={i}
                            className="border-t hover:bg-gray-50"
                        >
                            <td className="px-4 py-3">{i+1}</td>
                            <td className="px-4 py-3">
                                IEEE
                            </td>
                            <td className="px-4 py-3">
                                Deep Learning...
                            </td>
                            <td className="px-4 py-3">
                                IT
                            </td>
                            <td className="px-4 py-3">
                                ITNU
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}