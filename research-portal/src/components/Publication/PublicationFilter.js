import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import TextFilter from "./filters/TextFilter";
import DropdownFilter from "./filters/DropdownFilter";
import DepartmentFilter from "./filters/DepartmentFilter";
import AuthorFilter from "./filters/AuthorFilter";
import DateFilter from "./filters/DateFilter";
import MonthRangeFilter from "./filters/MonthRangeFilter";
import NumberRangeFilter from "./filters/NumberRangeFilter";
import { getDateOptions } from "../../utils/dateOptions";
import { getDepartmentLabel } from "../../config/publicationConfig";



export default function PublicationFilter({
    config,
    filters,
    onFiltersChange,
    onApply,
    onReset,
    mergeAuthors,
    onMergeAuthorsChange,
    options = {}
}) {

    /*
    |--------------------------------------------------------------------------
    | Collapse / expand
    |--------------------------------------------------------------------------
    */

    const [expanded, setExpanded] = useState(true);

    /*
     * config.filters is an ARRAY.
     *
     * Example:
     *
     * [
     *   { id: "paperTitle", type: "text" },
     *   { id: "department", type: "department" },
     *   ...
     * ]
     */

    const hasFilter = (id) => {
        return config?.filters?.some(
            filter => filter.id === id
        );
    };


    function updateField(field, value) {
        onFiltersChange({
            ...filters,
            [field]: value
        });
    }


    // ============================================================
    // DEPARTMENTS
    // ============================================================

    /*
     * Departments come from publicationConfig as CODES (e.g. "CSE"),
     * since that's what the backend filters on (deptCode). For
     * publication types with a code -> full-name mapping (currently
     * just journal, via DEPARTMENT_LABELS), we show the full name as
     * the checkbox label but keep submitting the code as the value -
     * that mismatch (full names being sent as the filter value) was
     * previously why the Journal department filter matched nothing.
     */

    const configDepartmentGroups =
        config?.departmentGroups ?? {};

    const configDepartmentCodes = Object.values(
        configDepartmentGroups
    ).flat();

    const departmentCodes = [
        ...new Set(
            (
                configDepartmentCodes.length > 0
                    ? configDepartmentCodes
                    : options.departments ?? []
            )
            .filter(Boolean)
        )
    ];

    const departments = departmentCodes.map(code => ({
        value: code,
        label: getDepartmentLabel(config?.key, code)
    }));


    // ============================================================
    // DATE OPTIONS
    // ============================================================

    const dateOptions = getDateOptions();

    const monthOptions =
        options.months?.length > 0
            ? options.months
            : dateOptions.months;

    const calendarYearOptions =
        options.years?.length > 0
            ? options.years
            : dateOptions.years;

    const academicYearOptions =
        options.academicYears?.length > 0
            ? options.academicYears
            : dateOptions.academicYears;

    const financialYearOptions =
        options.financialYears?.length > 0
            ? options.financialYears
            : dateOptions.financialYears;


    // ============================================================
    // ACTIVE FILTER COUNT (shown on the collapsed header)
    // ============================================================

    function countActiveFilters() {

        let count = 0;

        Object.entries(filters ?? {}).forEach(([key, value]) => {

            if (Array.isArray(value)) {
                if (value.length > 0) count++;
            } else if (value !== "" && value !== null && value !== undefined) {
                count++;
            }

        });

        return count;

    }

    const activeFilterCount = countActiveFilters();


    return (

        <div className="mb-6">

            {/* ================================================= */}
            {/* COLLAPSIBLE HEADER */}
            {/* ================================================= */}

            <button
                type="button"
                onClick={() => setExpanded(prev => !prev)}
                className="
                    w-full
                    flex
                    justify-between
                    items-center
                    bg-white
                    border border-gray-200
                    rounded-xl
                    px-6
                    py-4
                    hover:bg-gray-50
                    transition
                "
            >

                <div className="flex items-center gap-2">

                    <SlidersHorizontal size={18} className="text-gray-500" />

                    <span className="font-semibold text-gray-800">
                        Filters
                    </span>

                    {activeFilterCount > 0 && (

                        <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                            {activeFilterCount} active
                        </span>

                    )}

                </div>

                <ChevronDown
                    size={20}
                    className={`text-gray-500 transition-transform ${expanded ? "rotate-180" : ""}`}
                />

            </button>


            {/* ================================================= */}
            {/* COLLAPSIBLE BODY */}
            {/* ================================================= */}

            {expanded && (

                <div className="space-y-6 mt-4">

                    {/* ================================================= */}
                    {/* PUBLICATION-SPECIFIC FILTERS */}
                    {/* ================================================= */}

                    <div className="bg-white border border-gray-200 rounded-xl p-6">

                        <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            xl:grid-cols-3
                            gap-5
                        ">


                            {/* ========================= */}
                            {/* CONFERENCE NAME */}
                            {/* ========================= */}

                            {hasFilter("conferenceName") && (

                                <TextFilter
                                    label="Conference Name"
                                    value={filters.conferenceName ?? ""}
                                    onChange={(value) =>
                                        updateField(
                                            "conferenceName",
                                            value
                                        )
                                    }
                                />

                            )}


                            {/* ========================= */}
                            {/* PAPER TITLE */}
                            {/* ========================= */}

                            {hasFilter("paperTitle") && (

                                <TextFilter
                                    label="Paper Title"
                                    value={filters.paperTitle ?? ""}
                                    onChange={(value) =>
                                        updateField(
                                            "paperTitle",
                                            value
                                        )
                                    }
                                />

                            )}


                            {/* ========================= */}
                            {/* JOURNAL NAME */}
                            {/* ========================= */}

                            {hasFilter("journalName") && (

                                <TextFilter
                                    label="Name of Journal"
                                    value={filters.journalName ?? ""}
                                    onChange={(value) =>
                                        updateField(
                                            "journalName",
                                            value
                                        )
                                    }
                                />

                            )}


                            {/* ========================= */}
                            {/* BOOK TITLE */}
                            {/* ========================= */}

                            {hasFilter("bookTitle") && (

                                <TextFilter
                                    label="Book Title"
                                    value={filters.bookTitle ?? ""}
                                    onChange={(value) =>
                                        updateField(
                                            "bookTitle",
                                            value
                                        )
                                    }
                                />

                            )}


                            {/* ========================= */}
                            {/* BOOK CHAPTER TITLE */}
                            {/* ========================= */}

                            {hasFilter("bookChapterTitle") && (

                                <TextFilter
                                    label="Book Chapter Title"
                                    value={filters.bookChapterTitle ?? ""}
                                    onChange={(value) =>
                                        updateField(
                                            "bookChapterTitle",
                                            value
                                        )
                                    }
                                />

                            )}


                            {/* ========================= */}
                            {/* BOOK PUBLISHER */}
                            {/* ========================= */}

                            {hasFilter("publisher") && (

                                <TextFilter
                                    label="Name of Book Publisher"
                                    value={filters.publisher ?? ""}
                                    onChange={(value) =>
                                        updateField(
                                            "publisher",
                                            value
                                        )
                                    }
                                />

                            )}


                            {/* ========================= */}
                            {/* CONFERENCE TYPE */}
                            {/* ========================= */}

                            {hasFilter("conferenceType") && (

                                <DropdownFilter
                                    label="Conference Type"
                                    value={
                                        filters.conferenceType ?? "All"
                                    }
                                    options={
                                        options.conferenceTypes ?? []
                                    }
                                    onChange={(value) =>
                                        updateField(
                                            "conferenceType",
                                            value
                                        )
                                    }
                                />

                            )}


                            {/* ========================= */}
                            {/* JOURNAL TYPE */}
                            {/* ========================= */}

                            {hasFilter("journalType") && (

                                <DropdownFilter
                                    label="Journal Type"
                                    value={
                                        filters.journalType ?? "All"
                                    }
                                    options={
                                        options.journalTypes ?? []
                                    }
                                    onChange={(value) =>
                                        updateField(
                                            "journalType",
                                            value
                                        )
                                    }
                                />

                            )}


                            {/* ========================= */}
                            {/* PUBLICATION TYPE */}
                            {/* ========================= */}

                            {hasFilter("publicationType") && (

                                <DropdownFilter
                                    label="Publication Type"
                                    value={
                                        filters.publicationType ?? "All"
                                    }
                                    options={
                                        options.publicationTypes ?? []
                                    }
                                    onChange={(value) =>
                                        updateField(
                                            "publicationType",
                                            value
                                        )
                                    }
                                />

                            )}


                            {/* ========================= */}
                            {/* PUBLICATION CITY */}
                            {/* ========================= */}

                            {hasFilter("publicationCity") && (

                                <DropdownFilter
                                    label="Publication City"
                                    value={
                                        filters.publicationCity ?? "All"
                                    }
                                    options={
                                        options.publicationCities ?? []
                                    }
                                    onChange={(value) =>
                                        updateField(
                                            "publicationCity",
                                            value
                                        )
                                    }
                                />

                            )}


                            {/* ========================= */}
                            {/* INSTITUTE */}
                            {/* ========================= */}

                            {hasFilter("institute") && (

                                <DropdownFilter
                                    label="Institute"
                                    value={
                                        filters.instituteName ?? "All"
                                    }
                                    options={
                                        options.institutes ?? []
                                    }
                                    onChange={(value) =>
                                        updateField(
                                            "instituteName",
                                            value
                                        )
                                    }
                                />

                            )}


                            {/* ========================= */}
                            {/* DEPARTMENT */}
                            {/* ========================= */}

                            {hasFilter("department") && (

                                <DepartmentFilter
                                    selectedDepartments={
                                        filters.department ?? []
                                    }

                                    departments={departments}

                                    onChange={(value) =>
                                        updateField(
                                            "department",
                                            value
                                        )
                                    }
                                />

                            )}


                            {/* ========================= */}
                            {/* DEPARTMENT GROUP */}
                            {/* ========================= */}

                            {hasFilter("departmentGroup") && (

                                <DropdownFilter
                                    label="Department Group"
                                    value={
                                        filters.departmentGroup ??
                                        "All"
                                    }
                                    options={
                                        Object.keys(
                                            configDepartmentGroups
                                        )
                                    }
                                    onChange={(value) =>
                                        updateField(
                                            "departmentGroup",
                                            value
                                        )
                                    }
                                />

                            )}


                            {/* ========================= */}
                            {/* CLARIVATE IMPACT FACTOR */}
                            {/* ========================= */}

                            {hasFilter("impactFactorClarivate") && (

                                <NumberRangeFilter
                                    label="Impact Factor (Clarivate Analytics)"
                                    fromValue={
                                        filters.impactFactorClarivateFrom ??
                                        ""
                                    }
                                    toValue={
                                        filters.impactFactorClarivateTo ??
                                        ""
                                    }
                                    onFromChange={(value) =>
                                        updateField(
                                            "impactFactorClarivateFrom",
                                            value
                                        )
                                    }
                                    onToChange={(value) =>
                                        updateField(
                                            "impactFactorClarivateTo",
                                            value
                                        )
                                    }
                                />

                            )}


                            {/* ========================= */}
                            {/* JOURNAL IMPACT FACTOR */}
                            {/* ========================= */}

                            {hasFilter("impactFactorJournal") && (

                                <NumberRangeFilter
                                    label="Impact Factor (Journal)"
                                    fromValue={
                                        filters.impactFactorJournalFrom ??
                                        ""
                                    }
                                    toValue={
                                        filters.impactFactorJournalTo ??
                                        ""
                                    }
                                    onFromChange={(value) =>
                                        updateField(
                                            "impactFactorJournalFrom",
                                            value
                                        )
                                    }
                                    onToChange={(value) =>
                                        updateField(
                                            "impactFactorJournalTo",
                                            value
                                        )
                                    }
                                />

                            )}

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* AUTHOR FILTER */}
                    {/* ================================================= */}

                    {hasFilter("author") && (

                        <AuthorFilter
                            authorName={
                                filters.authorName ?? ""
                            }

                            selectedPositions={
                                filters.authorPositions ?? []
                            }

                            onAuthorNameChange={(value) =>
                                updateField(
                                    "authorName",
                                    value
                                )
                            }

                            onPositionsChange={(value) =>
                                updateField(
                                    "authorPositions",
                                    value
                                )
                            }

                            mergeAuthors={mergeAuthors}

                            onMergeAuthorsChange={
                                onMergeAuthorsChange
                            }
                        />

                    )}


                    {/* ================================================= */}
                    {/* FULL DATE RANGE */}
                    {/* ================================================= */}

                    {hasFilter("dateRange") &&
                        config?.dateMode === "fullDate" && (

                        <div className="
                            bg-white
                            border border-gray-200
                            rounded-xl
                            p-6
                        ">

                            <DateFilter
                                fromDate={
                                    filters.fromDate ?? ""
                                }

                                toDate={
                                    filters.toDate ?? ""
                                }

                                onChange={updateField}
                            />

                        </div>

                    )}


                    {/* ================================================= */}
                    {/* MONTH / YEAR RANGE */}
                    {/* ================================================= */}

                    {hasFilter("dateRange") &&
                        config?.dateMode === "monthYear" && (

                        <div className="
                            bg-white
                            border border-gray-200
                            rounded-xl
                            p-6
                        ">

                            <MonthRangeFilter
                                fromMonth={
                                    filters.fromMonth ?? ""
                                }

                                toMonth={
                                    filters.toMonth ?? ""
                                }

                                year={
                                    filters.year ?? ""
                                }

                                monthOptions={
                                    monthOptions
                                }

                                yearOptions={
                                    calendarYearOptions
                                }

                                onChange={updateField}
                            />

                        </div>

                    )}


                    {/* ================================================= */}
                    {/* YEAR FILTERS */}
                    {/* ================================================= */}

                    {(hasFilter("academicYear") ||
                        hasFilter("financialYear") ||
                        hasFilter("calendarYear")) && (

                        <div className="
                            bg-white
                            border border-gray-200
                            rounded-xl
                            p-6
                        ">

                            <div className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                xl:grid-cols-3
                                gap-5
                            ">


                                {/* ========================= */}
                                {/* ACADEMIC YEAR */}
                                {/* ========================= */}

                                {hasFilter("academicYear") && (

                                    <div>

                                        <label className="
                                            block
                                            text-sm
                                            font-medium
                                            mb-2
                                        ">

                                            Academic Year

                                            <span className="
                                                text-gray-400
                                                text-xs
                                                ml-2
                                            ">
                                                (July - June)
                                            </span>

                                        </label>

                                        <select
                                            value={
                                                filters.academicYear ??
                                                "All"
                                            }

                                            onChange={(e) =>
                                                updateField(
                                                    "academicYear",
                                                    e.target.value
                                                )
                                            }

                                            className="
                                                w-full
                                                border
                                                rounded-lg
                                                px-3
                                                py-2
                                                bg-white
                                            "
                                        >

                                            <option value="All">
                                                All
                                            </option>

                                            {academicYearOptions.map(
                                                (year) => (

                                                    <option
                                                        key={year.value}
                                                        value={year.value}
                                                    >
                                                        {year.label}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>

                                )}


                                {/* ========================= */}
                                {/* FINANCIAL YEAR */}
                                {/* ========================= */}

                                {hasFilter("financialYear") && (

                                    <div>

                                        <label className="
                                            block
                                            text-sm
                                            font-medium
                                            mb-2
                                        ">

                                            Financial Year

                                            <span className="
                                                text-gray-400
                                                text-xs
                                                ml-2
                                            ">
                                                (April - March)
                                            </span>

                                        </label>

                                        <select
                                            value={
                                                filters.financialYear ??
                                                "All"
                                            }

                                            onChange={(e) =>
                                                updateField(
                                                    "financialYear",
                                                    e.target.value
                                                )
                                            }

                                            className="
                                                w-full
                                                border
                                                rounded-lg
                                                px-3
                                                py-2
                                                bg-white
                                            "
                                        >

                                            <option value="All">
                                                All
                                            </option>

                                            {financialYearOptions.map(
                                                (year) => (

                                                    <option
                                                        key={year.value}
                                                        value={year.value}
                                                    >
                                                        {year.label}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>

                                )}


                                {/* ========================= */}
                                {/* CALENDAR YEAR */}
                                {/* ========================= */}

                                {hasFilter("calendarYear") && (

                                    <div>

                                        <label className="
                                            block
                                            text-sm
                                            font-medium
                                            mb-2
                                        ">

                                            Calendar Year

                                            <span className="
                                                text-gray-400
                                                text-xs
                                                ml-2
                                            ">
                                                (January - December)
                                            </span>

                                        </label>

                                        <select
                                            value={
                                                filters.calendarYear ??
                                                "All"
                                            }

                                            onChange={(e) =>
                                                updateField(
                                                    "calendarYear",
                                                    e.target.value
                                                )
                                            }

                                            className="
                                                w-full
                                                border
                                                rounded-lg
                                                px-3
                                                py-2
                                                bg-white
                                            "
                                        >

                                            <option value="All">
                                                All
                                            </option>

                                            {calendarYearOptions.map(
                                                (year) => (

                                                    <option
                                                        key={year.value}
                                                        value={year.value}
                                                    >
                                                        {year.label}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>

                                )}

                            </div>

                        </div>

                    )}


                    {/* ================================================= */}
                    {/* RESET / APPLY */}
                    {/* ================================================= */}

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onReset}
                            className="
                                px-5
                                py-2
                                border
                                border-gray-300
                                rounded-lg
                                text-sm
                                hover:bg-gray-100
                            "
                        >
                            Reset
                        </button>


                        <button
                            type="button"
                            onClick={onApply}
                            className="
                                px-5
                                py-2
                                rounded-lg
                                bg-emerald-600
                                text-white
                                text-sm
                                hover:bg-emerald-700
                            "
                        >
                            Apply Filters
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}