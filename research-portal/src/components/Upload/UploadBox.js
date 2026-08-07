import { UploadCloud, FileSpreadsheet, Loader2 } from "lucide-react";

export default function UploadBox({ selectedFile, onFileSelect, onUpload, uploading, error }){

    function handleFileChange(e){
        const file = e.target.files[0];
        if (file) onFileSelect(file);
    }

    function handleDrop(e){
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) onFileSelect(file);
    }

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

                <button
                    onClick={onUpload}
                    disabled={!selectedFile || uploading}
                    className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >

                    {uploading && <Loader2 size={16} className="animate-spin" />}

                    {uploading ? "Uploading..." : "Upload"}

                </button>

            </div>

            <label
                onDragOver={(e)=>e.preventDefault()}
                onDrop={handleDrop}
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
                    accept=".xls,.xlsx"
                    className="hidden"
                    onChange={handleFileChange}
                />

            </label>

            {selectedFile && (

                <div className="flex items-center gap-2 mt-5">

                    <FileSpreadsheet
                        size={18}
                        className="text-emerald-600"
                    />

                    <span className="text-sm">

                        {selectedFile.name}

                    </span>

                </div>

            )}

            {error && (

                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                    {error}

                </div>

            )}

        </div>

    );

}
