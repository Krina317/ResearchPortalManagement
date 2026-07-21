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

        <table border="1" style={{ marginTop: "10px" }}>

            <thead>

                <tr>

                    {

                        visibleColumns.map(column => (

                            <th

                                key={column}

                                style={{
                                    cursor: "pointer"
                                }}

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

                }

            </tbody>

        </table>

    );

};

export default DataTable;