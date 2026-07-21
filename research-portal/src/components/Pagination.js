const Pagination = ({
    currentPage,
    totalPages,
    setCurrentPage
}) => {

    return (

        <div className="pagination">

            <button

                className="btn-ghost"

                disabled={currentPage === 1}

                onClick={() =>
                    setCurrentPage(prev => prev - 1)
                }

            >

                ← Prev

            </button>

            <span className="pagination-status">

                Page <strong>{currentPage}</strong> of {totalPages || 1}

            </span>

            <button

                className="btn-ghost"

                disabled={
                    currentPage === totalPages ||
                    totalPages === 0
                }

                onClick={() =>
                    setCurrentPage(prev => prev + 1)
                }

            >

                Next →

            </button>

        </div>

    );

};

export default Pagination;