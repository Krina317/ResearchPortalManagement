import { ArrowUpDown, Pencil } from "lucide-react";

export default function ConferenceTable() {

    const columns = [

        "ID",

        "Conference",

        "Paper Title",

        "Department",

        "Institute",

        "From Date",

        "To Date",

        "Actions"

    ];

    return (

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

            <div className="px-5 py-4 border-b">

                <h2 className="font-semibold">

                    Showing 214 Records

                </h2>

            </div>

            <table className="w-full">

                <thead className="bg-gray-50">

                    <tr>

                        {columns.map(col=>(
                            <th
                                key={col}
                                className="px-4 py-3 text-left text-sm font-semibold text-gray-600"
                            >

                                <div className="flex items-center gap-1">

                                    {col}

                                    {col!=="Actions" &&

                                        <ArrowUpDown size={14}/>

                                    }

                                </div>

                            </th>
                        ))}

                    </tr>

                </thead>

                <tbody>

                    {[1,2,3,4,5].map(i=>(

                        <tr
                            key={i}
                            className="border-t hover:bg-gray-50"
                        >

                            <td className="px-4 py-3">{i}</td>

                            <td className="px-4 py-3">IEEE ICCCNT</td>

                            <td className="px-4 py-3">

                                Deep Learning Based...

                            </td>

                            <td className="px-4 py-3">

                                IT

                            </td>

                            <td className="px-4 py-3">

                                ITNU

                            </td>

                            <td className="px-4 py-3">

                                20/07/2025

                            </td>

                            <td className="px-4 py-3">

                                22/07/2025

                            </td>

                            <td className="px-4 py-3">

                                <button>

                                    <Pencil
                                        size={17}
                                        className="text-emerald-600"
                                    />

                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}