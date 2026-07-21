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

            <div className="toolbar-top">

                <button
                    className="btn-ghost"
                    onClick={() =>
                        setShowColumnPanel(prev => !prev)
                    }
                >
                    Columns {showColumnPanel ? "▴" : "▾"}
                </button>

                <span className="record-stamp">
                    <strong>{filteredData.length}</strong> of {data.length} records
                </span>

            </div>

            {

                showColumnPanel && (

                    <div className="column-panel">

                        {

                            columns.map(column => (

                                <label key={column}>

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

            {/* Toolbar */}

            <div className="toolbar-row">

                <div className="rows-per-page">

                    <label>Rows per page</label>

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

                </div>

                <button
                    className="btn-accent"

                    onClick={() =>
                        exportToExcel(
                            sortedData,
                            visibleColumns
                        )
                    }

                    disabled={sortedData.length === 0}

                >

                    ⇩ Download Excel

                </button>

            </div>

        </>

    );

};

export default Toolbar;