import { UploadCloud, FileSpreadsheet } from "lucide-react";

export default function UploadBox(){

    return(

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">

            <div className="flex justify-between items-center">

                <div>

                    <h2 className="font-semibold text-gray-700">

                        Upload Excel File

                    </h2>

                    <p className="text-sm text-gray-500 mt-1">

                        Supported formats : .xls .xlsx

                    </p>

                </div>

                <button className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700">

                    Update

                </button>

            </div>

            <label
                className="mt-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl py-12 cursor-pointer hover:bg-gray-50 transition"
            >

                <UploadCloud
                    size={40}
                    className="text-gray-400 mb-3"
                />

                <p className="font-medium">

                    Click to Upload

                </p>

                <p className="text-sm text-gray-500 mt-1">

                    or drag and drop

                </p>

                <input
                    type="file"
                    className="hidden"
                />

            </label>

            <div className="flex items-center gap-2 mt-5">

                <FileSpreadsheet
                    size={18}
                    className="text-emerald-600"
                />

                <span className="text-sm">

                    conference.xls

                </span>

            </div>

        </div>

    );

}