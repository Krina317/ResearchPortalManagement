import { FILTER_TYPES } from "../config/filterConfig";
import { departmentGroups } from "../utils/departmentGroups";

const FilterBar = ({
    filterMetadata,
    data,
    filters,
    setFilters,
    getDistinctValues
}) => {

    const updateFilter = (key, value) => {

        setFilters(prev => ({
            ...prev,
            [key]: value
        }));

    };

    // ==========================
    // TEXT / ID
    // ==========================

    const renderText = (filter) => (

        <div key={filter.id}>

            <label>{filter.label}</label>

            <input

                type="text"

                value={filters[filter.id] || ""}

                onChange={(e)=>

                    updateFilter(

                        filter.id,

                        e.target.value

                    )

                }

            />

        </div>

    );

    // ==========================
    // DROPDOWN
    // ==========================

    const renderDropdown = (filter) => (

        <div key={filter.id}>

            <label>{filter.label}</label>

            <select

                value={filters[filter.id] || ""}

                onChange={(e)=>

                    updateFilter(

                        filter.id,

                        e.target.value

                    )

                }

            >

                <option value="">

                    All

                </option>

                {

                    getDistinctValues(filter.column)

                        .map(value=>(

                            <option

                                key={value}

                                value={value}

                            >

                                {value}

                            </option>

                        ))

                }

            </select>

        </div>

    );

    // ==========================
    // DATE RANGE
    // ==========================

    const renderDateRange = () => (

        <div
            key="dateRange"
            style={{
                display:"flex",
                flexDirection:"column"
            }}
        >

            <label>Date Range</label>

            <input

                type="date"

                value={filters.startDate || ""}

                onChange={(e)=>

                    updateFilter(

                        "startDate",

                        e.target.value

                    )

                }

            />

            <input

                type="date"

                value={filters.endDate || ""}

                onChange={(e)=>

                    updateFilter(

                        "endDate",

                        e.target.value

                    )

                }

            />

        </div>

    );

    // ==========================
    // AUTHOR
    // ==========================

    const renderAuthor = (filter) => (

        <div key="author">

            <label>Author</label>

            <input

                type="text"

                placeholder="Author Name"

                value={filters.authorName || ""}

                onChange={(e)=>

                    updateFilter(

                        "authorName",

                        e.target.value

                    )

                }

            />

            <div
                style={{
                    marginTop:"5px"
                }}
            >

                {

                    filter.columns.map((col,index)=>{

                        const checked =

                            filters.authorPositions?.includes(index+1)

                            || false;

                        return(

                            <label
                                key={col}
                                style={{
                                    marginRight:"8px"
                                }}
                            >

                                <input

                                    type="checkbox"

                                    checked={checked}

                                    onChange={(e)=>{

                                        let positions =

                                            filters.authorPositions || [];

                                        if(e.target.checked){

                                            positions=[

                                                ...positions,

                                                index+1

                                            ];

                                        }

                                        else{

                                            positions=

                                                positions.filter(

                                                    p=>p!==index+1

                                                );

                                        }

                                        updateFilter(

                                            "authorPositions",

                                            positions

                                        );

                                    }}

                                />

                                {index+1}

                            </label>

                        );

                    })

                }

            </div>

        </div>

    );

    // ==========================
    // Department Group
    // ==========================

    const renderDepartmentGroup = () => (

        <div key="departmentGroup">

            <label>

                Department Group

            </label>

            <select

                value={filters.departmentGroup || ""}

                onChange={(e)=>

                    updateFilter(

                        "departmentGroup",

                        e.target.value

                    )

                }

            >

                <option value="">

                    All

                </option>

                {

                    Object.keys(departmentGroups)

                        .map(group=>(

                            <option

                                key={group}

                                value={group}

                            >

                                {group}

                            </option>

                        ))

                }

            </select>

        </div>

    );

    return(

        <div className="filter-grid">

            {

                filterMetadata.map(filter=>{

                    switch(filter.type){

                        case FILTER_TYPES.ID:

                            return renderText(filter);

                        case FILTER_TYPES.TEXT:

                            return renderText(filter);

                        case FILTER_TYPES.DROPDOWN:

                            return renderDropdown(filter);

                        case FILTER_TYPES.DATE_RANGE:

                            return renderDateRange(filter);

                        case FILTER_TYPES.AUTHOR:

                            return renderAuthor(filter);

                        case FILTER_TYPES.DEPARTMENT_GROUP:

                            return renderDepartmentGroup(filter);

                        default:

                            return null;

                    }

                })

            }

        </div>

    );

};

export default FilterBar;