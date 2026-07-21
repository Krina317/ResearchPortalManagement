const DataTable = ({
    pagedData,
    visibleColumns,
    sortColumn,
    sortDirection,
    setSortColumn,
    setSortDirection
}) => {

    const handleSort = (column) => {

        if (sortColumn === column) {

            setSortDirection(prev =>
                prev === "asc" ? "desc" : "asc"
            );

        }

        else {

            setSortColumn(column);

            setSortDirection("asc");

        }

    };

    return (

        <div className="table-scroll">

            <table>

                <thead>

                    <tr>

                        {

                            visibleColumns.map(column => (

                                <th

                                    key={column}

                                    onClick={() =>
                                        handleSort(column)
                                    }

                                >

                                    {column}

                                    {

                                        sortColumn === column &&

                                        (

                                            sortDirection === "asc"

                                                ? " ▲"

                                                : " ▼"

                                        )

                                    }

                                </th>

                            ))

                        }

                    </tr>

                </thead>

                <tbody>

                    {

                        pagedData.length === 0 ? (

                            <tr>
                                <td colSpan={visibleColumns.length || 1}>
                                    No records match the current filters.
                                </td>
                            </tr>

                        ) : (

                            pagedData.map((row, i) => (

                                <tr key={i}>

                                    {

                                        visibleColumns.map(column => (

                                            <td key={column}>

                                                {row[column]}

                                            </td>

                                        ))

                                    }

                                </tr>

                            ))

                        )

                    }

                </tbody>

            </table>

        </div>

    );

};

export default DataTable;