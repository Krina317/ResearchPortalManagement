import { exportToExcel } from "../utils/exportUtils";

const Toolbar = ({
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    data,
    filteredData,
    sortedData,
    visibleColumns,
    showColumnPanel,
    setShowColumnPanel,
    columns,
    selectedColumns,
    setSelectedColumns
}) => {

    const handleCheckboxChange = (column) => {

        setSelectedColumns(prev =>

            prev.includes(column)

                ? prev.filter(c => c !== column)

                : [...prev, column]

        );

    };

    return (

        <>

            {/* Column Selector */}

            <div style={{ margin: "10px 0" }}>

                <button
                    onClick={() =>
                        setShowColumnPanel(prev => !prev)
                    }
                >
                    Columns ▾
                </button>

                {

                    showColumnPanel && (

                        <div
                            style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                marginTop: "5px"
                            }}
                        >

                            {

                                columns.map(column => (

                                    <label
                                        key={column}
                                        style={{
                                            display: "block",
                                            marginBottom: "4px"
                                        }}
                                    >

                                        <input

                                            type="checkbox"

                                            checked={
                                                selectedColumns.includes(column)
                                            }

                                            onChange={() =>
                                                handleCheckboxChange(column)
                                            }

                                        />

                                        {column}

                                    </label>

                                ))

                            }

                        </div>

                    )

                }

            </div>

            {/* Toolbar */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px"
                }}
            >

                <label>

                    Rows per page{" "}

                    <select

                        value={rowsPerPage}

                        onChange={(e) => {

                            setRowsPerPage(Number(e.target.value));

                            setCurrentPage(1);

                        }}

                    >

                        <option value={10}>10</option>

                        <option value={20}>20</option>

                        <option value={50}>50</option>

                    </select>

                </label>

                <button

                    onClick={() =>
                        exportToExcel(
                            sortedData,
                            visibleColumns
                        )
                    }

                    disabled={sortedData.length === 0}

                >

                    Download Excel

                </button>

            </div>

            <div
                style={{
                    marginBottom: "10px",
                    fontWeight: "bold"
                }}
            >

                Showing {filteredData.length} of {data.length} records

            </div>

        </>

    );

};

export default Toolbar;