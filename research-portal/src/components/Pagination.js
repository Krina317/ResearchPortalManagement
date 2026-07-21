const Pagination = ({
    currentPage,
    totalPages,
    setCurrentPage
}) => {

    return (

        <div style={{ marginTop: "15px" }}>

            <button

                disabled={currentPage === 1}

                onClick={() =>
                    setCurrentPage(prev => prev - 1)
                }

            >

                Prev

            </button>

            <span style={{ margin: "0 10px" }}>

                Page {currentPage} of {totalPages || 1}

            </span>

            <button

                disabled={
                    currentPage === totalPages ||
                    totalPages === 0
                }

                onClick={() =>
                    setCurrentPage(prev => prev + 1)
                }

            >

                Next

            </button>

        </div>

    );

};

export default Pagination;