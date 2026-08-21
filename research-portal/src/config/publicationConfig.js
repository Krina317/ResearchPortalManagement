export const PUBLICATION_TYPES = {
    CONFERENCE: "conference",
    JOURNAL: "journal",
    BOOK_CHAPTER: "book-chapters"
};


/*
|--------------------------------------------------------------------------
| Common filters
|--------------------------------------------------------------------------
*/

const COMMON_FILTERS = {
    department: {
        type: "department"
    },

    institute: {
        type: "dropdown",
        label: "Institute",
        field: "instituteName"
    },

    author: {
        type: "author",
        label: "Author"
    }
};


/*
|--------------------------------------------------------------------------
| Conference department grouping
|--------------------------------------------------------------------------
*/

const CONFERENCE_DEPARTMENT_GROUPS = {
    CSE: [
        "IT",
        "CSE",
        "MCA",
        "PGIN"
    ]
};


/*
|--------------------------------------------------------------------------
| Journal / Book Chapter department grouping
|--------------------------------------------------------------------------
| IMPORTANT: these must be dept CODES, not full names. The backend
| (JournalPaperSpecifications) filters on `deptCode`
| (root.get("deptCode").in(departments)), so sending full names here as
| the checkbox values meant the department filter silently matched
| nothing - every "department" param sent would never equal any actual
| deptCode in the DB.
|
| These 4 codes match what's currently active in the department_list
| table for JOURNAL (CSE, MCA, IT, PGINS). If you activate more journal
| departments in the DB, add their codes here too.
|--------------------------------------------------------------------------
*/

const JOURNAL_BOOK_DEPARTMENT_GROUPS = {
    Departments: [
        "CSE",
        "MCA",
        "IT",
        "PGINS"
    ]
};


/*
|--------------------------------------------------------------------------
| Dept code -> full display name
|--------------------------------------------------------------------------
| The backend only ever returns the short deptCode (e.g. "CSE"), never
| the full department name. This lookup is purely for display (table
| column, export, department filter checkbox labels) - filtering still
| happens on the code.
|--------------------------------------------------------------------------
*/

export const DEPARTMENT_LABELS = {

    journal: {
        CSE: "Computer Science & Eng. Dept. (UG)",
        MCA: "M. C. A.",
        IT: "Information Technology Eng. Dept. (UG)",
        PGINS: "PG - Information & Network Security"
    }

    // conference doesn't need this - its deptCode values (IT, CSE, MCA,
    // PGIN) are already short and shown as-is.

};

export function getDepartmentLabel(publicationType, code) {
    return DEPARTMENT_LABELS[publicationType]?.[code] ?? code;
}


/*
|--------------------------------------------------------------------------
| Conference
|--------------------------------------------------------------------------
*/

const CONFERENCE_CONFIG = {

    key: PUBLICATION_TYPES.CONFERENCE,

    title: "Conference Papers",

    singularTitle: "Conference Paper",

    endpoint: "conference",

    dateMode: "fullDate",

    departmentGroups: CONFERENCE_DEPARTMENT_GROUPS,

    filters: [
        {
            id: "conferenceName",
            label: "Conference Name",
            type: "text",
            field: "conferenceName"
        },
        {
            id: "paperTitle",
            label: "Paper Title",
            type: "text",
            field: "paperTitle"
        },
        {
            id: "conferenceType",
            label: "Conference Type",
            type: "dropdown",
            field: "conferenceType"
        },
        {
            id: "department",
            label: "Department",
            type: "department"
        },
        {
            id: "departmentGroup",
            label: "Department Group",
            type: "departmentGroup"
        },
        {
            id: "institute",
            label: "Institute",
            type: "dropdown",
            field: "instituteName"
        },
        {
            id: "author",
            label: "Author",
            type: "author"
        },
        {
            id: "dateRange",
            label: "Date",
            type: "dateRange",
            fromField: "fromDate",
            toField: "toDate"
        },
        {
            id: "academicYear",
            label: "Academic Year",
            type: "year"
        },
        {
            id: "financialYear",
            label: "Financial Year",
            type: "year"
        },
        {
            id: "calendarYear",
            label: "Calendar Year",
            type: "year"
        }
    ],

    // NOTE: keys/fields below mirror the ConferenceListItemDTO the backend
    // returns (conferenceName, paperTitle, conferenceType, deptCode,
    // instituteName, fromDate, toDate, authors) - NOT the raw excel column
    // headers ("Name of Conference", "InstName", etc). Excel headers only
    // matter inside ConferenceImportService's ExcelColumnMap lookup on
    // upload; everything downstream of that (search, table, export) talks
    // in DTO field names, which is what this file should mirror. This was
    // the source of the mismatched/empty column-selector bug.
    // `sortable: true` on conferenceType/deptCode requires the backend's
    // ALLOWED_SORT_FIELDS to include them too - see ConferenceQueryController.
    columns: [
        {
            key: "id",
            label: "ID",
            field: "id",
            sortable: true
        },

        {
            key: "conferenceName",
            label: "Name of Conference",
            field: "conferenceName",
            sortable: true
        },

        {
            key: "paperTitle",
            label: "Paper Title",
            field: "paperTitle",
            sortable: true
        },

        {
            key: "conferenceType",
            label: "Conference Type",
            field: "conferenceType",
            sortable: true
        },

        {
            key: "deptCode",
            label: "Department",
            field: "deptCode",
            sortable: true
        },

        {
            key: "instituteName",
            label: "Institute Name",
            field: "instituteName",
            sortable: true
        },

        {
            key: "fromDate",
            label: "From Date",
            field: "fromDate",
            sortable: true
        },

        {
            key: "toDate",
            label: "To Date",
            field: "toDate",
            sortable: true
        },

        {
            key: "author1",
            label: "Author 1",
            field: "author1",
            sortable: false,
            authorPosition: 1
        },
        {
            key: "author2",
            label: "Author 2",
            field: "author2",
            sortable: false,
            authorPosition: 2
        },
        {
            key: "author3",
            label: "Author 3",
            field: "author3",
            sortable: false,
            authorPosition: 3
        },
        {
            key: "author4",
            label: "Author 4",
            field: "author4",
            sortable: false,
            authorPosition: 4
        },
        {
            key: "author5",
            label: "Author 5",
            field: "author5",
            sortable: false,
            authorPosition: 5
        },
        {
            key: "author6",
            label: "Author 6",
            field: "author6",
            sortable: false,
            authorPosition: 6
        },
        {
            key: "author7",
            label: "Author 7",
            field: "author7",
            sortable: false,
            authorPosition: 7
        },
        {
            key: "author8",
            label: "Author 8",
            field: "author8",
            sortable: false,
            authorPosition: 8
        },
        {
            key: "author9",
            label: "Author 9",
            field: "author9",
            sortable: false,
            authorPosition: 9
        },
        {
            key: "author10",
            label: "Author 10",
            field: "author10",
            sortable: false,
            authorPosition: 10
        }
    ]

};


/*
|--------------------------------------------------------------------------
| Journal
|--------------------------------------------------------------------------
*/

const JOURNAL_CONFIG = {

    key: PUBLICATION_TYPES.JOURNAL,

    title: "Journal Publications",

    singularTitle: "Journal Publication",

    endpoint: "journal",

    dateMode: "monthYear",

    departmentGroups: JOURNAL_BOOK_DEPARTMENT_GROUPS,

    filters: [
        {
            id: "paperTitle",
            label: "Paper Title",
            type: "text",
            field: "paperTitle"
        },
        {
            id: "journalName",
            label: "Name of Journal",
            type: "text",
            field: "journalName"
        },

        {
            id: "department",
            label: "Department",
            type: "department"
        },

        {
            id: "departmentGroup",
            label: "Department Group",
            type: "departmentGroup"
        },

        {
            id: "institute",
            label: "Institute",
            type: "dropdown",
            field: "instituteName"
        },
        {
            id: "journalType",
            label: "Journal Type",
            type: "dropdown",
            field: "journalType"
        },
        {
            id: "impactFactorClarivate",
            label: "Impact Factor (Clarivate Analytics)",
            type: "numberRange",
            fromField: "impactFactorClarivate",
            toField: "impactFactorClarivate"
        },
        {
            id: "impactFactorJournal",
            label: "Impact Factor (Journal)",
            type: "numberRange",
            fromField: "impactFactorJournal",
            toField: "impactFactorJournal"
        },
        {
            id: "author",
            label: "Author",
            type: "author"
        },
        {
            id: "dateRange",
            label: "Publication Period",
            type: "monthRange",
            monthField: "monthOfPublication",
            yearField: "yearOfPublication"
        },
        {
            id: "academicYear",
            label: "Academic Year",
            type: "year"
        },
        {
            id: "financialYear",
            label: "Financial Year",
            type: "year"
        },
        {
            id: "calendarYear",
            label: "Calendar Year",
            type: "year"
        }
    ],

    columns: [
        {
            key: "id",
            label: "ID",
            field: "id",
            sortable: true
        },

        {
            key: "paperTitle",
            label: "Paper Title",
            field: "paperTitle",
            sortable: false
        },

        {
            key: "journalName",
            label: "Name of Journal",
            field: "journalName",
            sortable: false
        },

        {
            key: "journalType",
            label: "Journal Type",
            field: "journalType",
            sortable: false
        },

        {
            key: "impactFactorClarivate",
            label: "Impact Factor (Clarivate Analytics)",
            field: "impactFactorClarivate",
            sortable: false
        },

        {
            key: "impactFactorJournal",
            label: "Impact Factor (Journal)",
            field: "impactFactorJournal",
            sortable: false
        },

        {
            key: "volumeNo",
            label: "Volume No",
            field: "volumeNo",
            sortable: false
        },

        {
            key: "issueNo",
            label: "Issue No",
            field: "issueNo",
            sortable: false
        },

        {
            key: "pageNo",
            label: "Page No",
            field: "pageNo",
            sortable: false
        },

        {
            key: "monthOfPublication",
            label: "Month of Publication",
            field: "monthOfPublication",
            sortable: false
        },

        {
            key: "yearOfPublication",
            label: "Year of Publication",
            field: "yearOfPublication",
            sortable: true
        },

        {
            key: "author1",
            label: "Author 1",
            field: "author1",
            sortable: false,
            authorPosition: 1
        },
        {
            key: "author2",
            label: "Author 2",
            field: "author2",
            sortable: false,
            authorPosition: 2
        },
        {
            key: "author3",
            label: "Author 3",
            field: "author3",
            sortable: false,
            authorPosition: 3
        },
        {
            key: "author4",
            label: "Author 4",
            field: "author4",
            sortable: false,
            authorPosition: 4
        },
        {
            key: "author5",
            label: "Author 5",
            field: "author5",
            sortable: false,
            authorPosition: 5
        },
        {
            key: "author6",
            label: "Author 6",
            field: "author6",
            sortable: false,
            authorPosition: 6
        },
        {
            key: "author7",
            label: "Author 7",
            field: "author7",
            sortable: false,
            authorPosition: 7
        },
        {
            key: "author8",
            label: "Author 8",
            field: "author8",
            sortable: false,
            authorPosition: 8
        },
        {
            key: "author9",
            label: "Author 9",
            field: "author9",
            sortable: false,
            authorPosition: 9
        },
        {
            key: "author10",
            label: "Author 10",
            field: "author10",
            sortable: false,
            authorPosition: 10
        },

        {
            key: "instituteName",
            label: "Institute",
            field: "instituteName",
            sortable: false
        },

        {
            key: "deptCode",
            label: "Department",
            field: "deptName",
            sortable: false
        }
    ]

};


/*
|--------------------------------------------------------------------------
| Book Chapters
|--------------------------------------------------------------------------
*/

const BOOK_CHAPTER_CONFIG = {

    key: PUBLICATION_TYPES.BOOK_CHAPTER,

    title: "Book Chapters",

    singularTitle: "Book Chapter",

    endpoint: "book-chapters",

    dateMode: "monthYear",

    departmentGroups: JOURNAL_BOOK_DEPARTMENT_GROUPS,

    filters: [

        {
            id: "bookTitle",
            label: "Book Title",
            type: "text",
            field: "bookTitle"
        },

        {
            id: "bookChapterTitle",
            label: "Book Chapter Title",
            type: "text",
            field: "bookChapterTitle"
        },

        {
            id: "publisher",
            label: "Name of Book Publisher",
            type: "text",
            field: "nameOfBookPublisher"
        },

        {
            id: "department",
            label: "Department",
            type: "department"
        },

        {
            id: "departmentGroup",
            label: "Department Group",
            type: "departmentGroup"
        },

        {
            id: "institute",
            label: "Institute",
            type: "dropdown",
            field: "instituteName"
        },

        {
            id: "author",
            label: "Author",
            type: "author"
        },

        {
            id: "publicationType",
            label: "Publication Type",
            type: "dropdown",
            field: "publicationType",
            distinctFromDatabase: true
        },

        {
            id: "publicationCity",
            label: "Publication City",
            type: "dropdown",
            field: "publicationCity",
            distinctFromDatabase: true
        },

        {
            id: "yearOfPublication",
            label: "Year of Publication",
            type: "dropdown",
            field: "yearOfPublication",
            distinctFromDatabase: true
        },

        {
            id: "dateRange",
            label: "Publication Period",
            type: "monthRange",
            monthField: "month",
            yearField: "year"
        },

        {
            id: "academicYear",
            label: "Academic Year",
            type: "year"
        },

        {
            id: "financialYear",
            label: "Financial Year",
            type: "year"
        },

        {
            id: "calendarYear",
            label: "Calendar Year",
            type: "year"
        }
    ],

    columns: [
        {
            key: "id",
            label: "ID",
            field: "id",
            sortable: true
        },

        {
            key: "bookTitle",
            label: "Book Title",
            field: "bookTitle",
            sortable: true
        },

        {
            key: "bookChapterTitle",
            label: "Book Chapter Title",
            field: "bookChapterTitle",
            sortable: true
        },

        {
            key: "nameOfBookPublisher",
            label: "Name of Book Publisher",
            field: "nameOfBookPublisher",
            sortable: true
        },

        {
            key: "month",
            label: "Month",
            field: "month",
            sortable: true
        },

        {
            key: "year",
            label: "Year",
            field: "year",
            sortable: true
        },

        {
            key: "yearOfPublication",
            label: "Year of Publication",
            field: "yearOfPublication",
            sortable: true
        },

        {
            key: "isbnNo",
            label: "ISBN No",
            field: "isbnNo",
            sortable: true
        },

        {
            key: "publicationType",
            label: "Publication Type",
            field: "publicationType",
            sortable: true
        },

        {
            key: "publicationCity",
            label: "Publication City",
            field: "publicationCity",
            sortable: true
        },

        {
            key: "author1",
            label: "Author 1",
            field: "author1",
            sortable: false,
            authorPosition: 1
        },
        {
            key: "author2",
            label: "Author 2",
            field: "author2",
            sortable: false,
            authorPosition: 2
        },
        {
            key: "author3",
            label: "Author 3",
            field: "author3",
            sortable: false,
            authorPosition: 3
        },
        {
            key: "author4",
            label: "Author 4",
            field: "author4",
            sortable: false,
            authorPosition: 4
        },
        {
            key: "author5",
            label: "Author 5",
            field: "author5",
            sortable: false,
            authorPosition: 5
        },
        {
            key: "author6",
            label: "Author 6",
            field: "author6",
            sortable: false,
            authorPosition: 6
        },
        {
            key: "author7",
            label: "Author 7",
            field: "author7",
            sortable: false,
            authorPosition: 7
        },
        {
            key: "author8",
            label: "Author 8",
            field: "author8",
            sortable: false,
            authorPosition: 8
        },
        {
            key: "author9",
            label: "Author 9",
            field: "author9",
            sortable: false,
            authorPosition: 9
        },
        {
            key: "author10",
            label: "Author 10",
            field: "author10",
            sortable: false,
            authorPosition: 10
        },

        {
            key: "instituteName",
            label: "Institute",
            field: "instituteName",
            sortable: true
        },

        {
            key: "departmentName",
            label: "Department",
            field: "departmentName",
            sortable: true
        }
    ]

};


/*
|--------------------------------------------------------------------------
| Export all configurations
|--------------------------------------------------------------------------
*/

export const PUk bjgq;3o5ipBLICATION_CONFIG = {
    [PUBLICATION_TYPES.CONFERENCE]: CONFERENCE_CONFIG,
    [PUBLICATION_TYPES.JOURNAL]: JOURNAL_CONFIG,
    [PUBLICATION_TYPES.BOOK_CHAPTER]: BOOK_CHAPTER_CONFIG
};


export const getPublicationConfig = (type) => {
    return PUBLICATION_CONFIG[type];
};m3gr=3u5-h9nioby[20]