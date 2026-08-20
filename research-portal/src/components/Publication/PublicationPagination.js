export default function PublicationPagination({
    page,
    totalPages,
    onPageChange,
    pageSize,
    pageSizeOptions = [10, 20, 50, 100],
    onPageSizeChange
}) {

    const currentPage = page + 1;

    function goToPage(newPage) {

        if (
            newPage < 0 ||
            newPage >= totalPages
        ) {
            return;
        }

        onPageChange(newPage);

    }

    return (

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-5">

            <div className="flex items-center gap-4">

                <p className="text-sm text-gray-500">

                    Page {currentPage} of{" "}
                    {Math.max(totalPages, 1)}

                </p>

                {onPageSizeChange && (

                    <div className="flex items-center gap-2">

                        <label className="text-sm text-gray-500">
                            Rows per page
                        </label>

                        <select
                            value={pageSize}
                            onChange={(e) =>
                                onPageSizeChange(Number(e.target.value))
                            }
                            className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm bg-white"
                        >

                            {pageSizeOptions.map(size => (

                                <option key={size} value={size}>
                                    {size}
                                </option>

                            ))}

                        </select>

                    </div>

                )}

            </div>

            <div className="flex items-center gap-2">

                <button
                    onClick={() =>
                        goToPage(page - 1)
                    }
                    disabled={page === 0}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                <button
                    onClick={() =>
                        goToPage(page + 1)
                    }
                    disabled={
                        totalPages === 0 ||
                        page >= totalPages - 1
                    }
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>

            </div>

        </div>

    );

}