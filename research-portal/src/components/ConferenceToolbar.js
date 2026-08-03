import { Upload, Download, Columns3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ColumnSelector from "./ColumnSelector";

export default function ConferenceToolbar() {
    const navigate = useNavigate();
    return (

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">

            <div className="flex justify-between items-center">

                <div>

                    <h2 className="font-semibold text-gray-700">
                        Actions
                    </h2>

                </div>

                <div className="flex gap-3">

                <button
                    onClick={() => navigate("/upload/conference")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >

                    <Upload size={18}/>

                    Upload New

                </button>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">

                        <Download size={18}/>

                        Export Excel

                    </button>

                    <ColumnSelector/>

                </div>

            </div>

        </div>

    );

}