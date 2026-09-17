export const PUBLICATION_TYPES = {
    CONFERENCE: "conference",
    JOURNAL: "journal",
    BOOK_CHAPTER: "book-chapters"
};

const CONFERENCE_CONFIG = {
    key: PUBLICATION_TYPES.CONFERENCE,
    title: "Conference Papers",
    singularTitle: "Conference Paper",
    endpoint: "conference",
    dateMode: "fullDate",
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
            id: "institute",
            label: "Institute Name",
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
    ]
};
const JOURNAL_CONFIG = {
    key: PUBLICATION_TYPES.JOURNAL,
    title: "Journal Publications",
    singularTitle: "Journal Publication",
    endpoint: "journal",
    dateMode: "monthYear",
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
            id: "indexIn",
            label: "Index In",
            type: "multiDropdown",
            field: "indexIn"
        },
        {
            id: "issnNo",
            label: "ISSN No",
            type: "text",
            field: "issnNo"
        },
        {
            id: "volumeNo",
            label: "Volume No",
            type: "text",
            field: "volumeNo"
        },
        {
            id: "issueNo",
            label: "Issue No",
            type: "text",
            field: "issueNo"
        },
        {
            id: "pageNo",
            label: "Page No",
            type: "text",
            field: "pageNo"
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
        
        
    ]

};
const BOOK_CHAPTER_CONFIG = {
    key: PUBLICATION_TYPES.BOOK_CHAPTER,
    title: "Book Chapters",
    singularTitle: "Book Chapter",
    endpoint: "book-chapters",
    dateMode: "monthYear",
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
            id: "institute",
            label: "Institute",
            type: "dropdown",
            field: "instituteName"
        },
        {
            id: "isbnNo",
            label: "ISBN No",
            type: "text",
            field: "isbnNo"
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

export const PUBLICATION_CONFIG = {
    [PUBLICATION_TYPES.CONFERENCE]: CONFERENCE_CONFIG,
    [PUBLICATION_TYPES.JOURNAL]: JOURNAL_CONFIG,
    [PUBLICATION_TYPES.BOOK_CHAPTER]: BOOK_CHAPTER_CONFIG
};
export const getPublicationConfig = (type) => {
    return PUBLICATION_CONFIG[type];
};