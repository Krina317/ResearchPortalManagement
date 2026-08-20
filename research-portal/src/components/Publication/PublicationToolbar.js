import { Upload, Download, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicationColumns from "./PublicationColumns";

export default function PublicationToolbar({
    config,
    selectedColumns,
    onColumnsChange,
    onExport,
    exporting
}) {

    const navigate = useNavigate();

    return (

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">

            <div className="flex flex-wrap justify-between items-center gap-3">

                <div>

                    <h2 className="font-semibold text-gray-700">
                        Actions
                    </h2>

                </div>

                <div className="flex flex-wrap gap-3">

                    <button
                        onClick={() =>
                            navigate(`/upload/${config.key}`)
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                    >

                        <Upload size={18} />

                        Upload New

                    </button>


                    <button
                        onClick={onExport}
                        disabled={exporting}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >

                        {exporting
                            ? <Loader2
                                size={18}
                                className="animate-spin"
                              />
                            : <Download size={18} />
                        }

                        {exporting
                            ? "Exporting..."
                            : "Export Excel"
                        }

                    </button>


                    {/*
                        FIX: was passing `columns={config.columns}` but
                        PublicationColumns previously ignored it and looked
                        for a `publicationType` prop it never received.
                        PublicationColumns is now rewritten to consume
                        `columns` directly, so this prop actually does
                        something now.
                    */}
                    <PublicationColumns

                        columns={config.columns}

                        selectedColumns={selectedColumns}

                        onColumnsChange={onColumnsChange}

                    />

                </div>

            </div>

        </div>

    );

}