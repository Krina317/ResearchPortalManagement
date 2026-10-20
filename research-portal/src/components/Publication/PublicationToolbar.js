import { Upload, Download, Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicationColumns from "./PublicationColumns";

/*
 * `crud` is optional. When it is passed (journal only) the toolbar shows
 * Add / Edit / Delete. Shape:
 *   { mode, selectedCount, busy, onAdd, onStartEdit, onStartDelete, onConfirm, onCancel }
 * mode is null, "edit" or "delete".
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

                    {crud && !crud.mode && (
                        <>
                            <button
                                onClick={crud.onAdd}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                <Plus size={18} />
                                Add
                            </button>

                            <button
                                onClick={crud.onStartEdit}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                            >
                                <Pencil size={18} />
                                Edit
                            </button>

                            <button
                                onClick={crud.onStartDelete}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                            >
                                <Trash2 size={18} />
                                Delete
                            </button>
                        </>
                    )}

                    {crud && crud.mode === "edit" && (
                        <>
                            <span className="self-center text-sm text-gray-500">
                                Select one paper to edit
                            </span>

                            <button
                                onClick={crud.onConfirm}
                                disabled={crud.selectedCount !== 1}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Pencil size={18} />
                                Edit selected
                            </button>

                            <button
                                onClick={crud.onCancel}
                                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </>
                    )}

                    {crud && crud.mode === "delete" && (
                        <>
                            <span className="self-center text-sm text-gray-500">
                                Select the papers to delete
                            </span>

                            <button
                                onClick={crud.onConfirm}
                                disabled={crud.selectedCount === 0 || crud.busy}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {crud.busy
                                    ? <Loader2 size={18} className="animate-spin" />
                                    : <Trash2 size={18} />
                                }
                                {crud.busy
                                    ? "Deleting..."
                                    : `Delete selected (${crud.selectedCount})`
                                }
                            </button>

                            <button
                                onClick={crud.onCancel}
                                disabled={crud.busy}
                                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </>
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