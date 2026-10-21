import { Upload, Download, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicationColumns from "./PublicationColumns";

/*
 * `crud` is optional. When it is passed the toolbar shows an Add button.
 * Edit / Delete now live on each table row.
 *   crud = { onAdd }
 */
export default function PublicationToolbar({
    config,
    selectedColumns,
    onColumnsChange,
    onExport,
    exporting,
    crud
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

                    {crud && (
                        <button
                            onClick={crud.onAdd}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            <Plus size={18} />
                            Add
                        </button>
                    )}

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