export default function Pagination({ page, totalPages, onPageChange }) {

    const currentPage = page + 1;

    function goTo(p){
        if (p < 0 || p >= totalPages) return;
        onPageChange(p);
    }

    return (
        <div className="flex justify-between items-center mt-5">

            <p className="text-gray-500">
                Page {currentPage} of {Math.max(totalPages, 1)}
            </p>

            <div className="flex gap-2">
                <button
                    onClick={() => goTo(page - 1)}
                    disabled={page === 0}
                    className="border px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                    onClick={() => goTo(page + 1)}
                    disabled={page >= totalPages - 1}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>

        </div>
    );
}