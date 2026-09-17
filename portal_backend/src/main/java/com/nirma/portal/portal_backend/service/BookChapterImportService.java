package com.nirma.portal.portal_backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nirma.portal.portal_backend.entity.DepartmentList;
import com.nirma.portal.portal_backend.entity.ExcelColumnMap;
import com.nirma.portal.portal_backend.entity.BookChapter;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.repository.BookChapterRepository;
import com.nirma.portal.portal_backend.repository.DepartmentListRepository;
import com.nirma.portal.portal_backend.repository.ExcelColumnMapRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookChapterImportService {

    private final BookChapterRepository bookChapterRepository;
    private final DepartmentListRepository departmentListRepository;
    private final ExcelColumnMapRepository excelColumnMapRepository;
    private final BookChapterRowPersister bookChapterRowPersister;

    private static final String BOOK_CHAPTER_ENTITY = "BookChapter";
    private static final String AUTHOR_COLUMN_PREFIX = "Author";
    private static final int MAX_AUTHOR_COLUMNS = 10;

    public BookChapterImportResult importBookChapters(MultipartFile file) {

        validateFile(file);

        Document doc = parseHtml(file);

        Element table = doc.selectFirst("table");

        if (table == null) {
            throw new IllegalArgumentException(
                    "No table found in uploaded file."
            );
        }

        Elements rows = table.select("tr");

        if (rows.isEmpty()) {
            throw new IllegalArgumentException(
                    "Sheet has no header row."
            );
        }

        List<ExcelColumnMap> mappings =
                excelColumnMapRepository
                        .findByPublicationTypeAndEnabledTrue(
                                PublicationType.BOOK_CHAPTER
                        );

        Map<String, Integer> headerIndex =
                validateHeader(rows.get(0), mappings);

        List<DepartmentList> departments =
                departmentListRepository
                        .findByPublicationTypeAndActiveTrue(
                                PublicationType.BOOK_CHAPTER
                        );

        Set<String> allowedDeptNames =
                departments.stream()
                        .map(DepartmentList::getDeptName)
                        .filter(name -> name != null && !name.isBlank())
                        .map(name -> name.trim().toUpperCase())
                        .collect(Collectors.toCollection(HashSet::new));

        BookChapterImportResult result =
                new BookChapterImportResult();

        processRows(
                rows,
                headerIndex,
                mappings,
                allowedDeptNames,
                result
        );

        return result;
    }

    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Uploaded file is empty."
            );
        }

        String fileName = file.getOriginalFilename();

        if (fileName == null ||
                !(fileName.endsWith(".xls") ||
                  fileName.endsWith(".xlsx"))) {

            throw new IllegalArgumentException(
                    "Only Excel (.xls or .xlsx) files are allowed."
            );
        }
    }

    private Document parseHtml(MultipartFile file) {

        try {
            return Jsoup.parse(
                    file.getInputStream(),
                    "UTF-8",
                    ""
            );

        } catch (Exception e) {

            throw new IllegalArgumentException(
                    "Could not read the uploaded file.",
                    e
            );
        }
    }

    private Map<String, Integer> validateHeader(
            Element headerRow,
            List<ExcelColumnMap> mappings
    ) {

        Map<String, Integer> headerIndex =
                new HashMap<>();

        Elements headerCells =
                headerRow.select("th");

        if (headerCells.isEmpty()) {
            headerCells = headerRow.select("td");
        }

        int index = 0;

        for (Element cell : headerCells) {

            String header =
                    cell.text().trim();

            if (!header.isEmpty()) {
                headerIndex.put(header, index);
            }

            index++;
        }

        List<String> missing =
                mappings.stream()
                        .filter(m ->
                                Boolean.TRUE.equals(
                                        m.getRequired()
                                )
                        )
                        .map(ExcelColumnMap::getExcelColName)
                        .filter(col ->
                                !headerIndex.containsKey(col)
                        )
                        .toList();

        if (!missing.isEmpty()) {

            throw new IllegalArgumentException(
                    "Missing required column(s) in uploaded file: "
                    + String.join(", ", missing)
            );
        }

        return headerIndex;
    }

    private void processRows(
            Elements rows,
            Map<String, Integer> headerIndex,
            List<ExcelColumnMap> mappings,
            Set<String> allowedDeptNames,
            BookChapterImportResult result
    ) {

        for (int r = 1; r < rows.size(); r++) {

            Elements cells =
                    rows.get(r).select("td");

            if (cells.isEmpty() || isRowEmpty(cells)) {
                continue;
            }

            try {

                processRow(
                        cells,
                        headerIndex,
                        mappings,
                        allowedDeptNames,
                        result
                );

            } catch (Exception e) {

                result.recordSkippedError(
                        "Row " + (r + 1) + ": " + e.getMessage()
                );
            }
        }
    }

    private void processRow(
            Elements cells,
            Map<String, Integer> headerIndex,
            List<ExcelColumnMap> mappings,
            Set<String> allowedDeptNames,
            BookChapterImportResult result
    ) {

        BookChapter bookChapter =
                new BookChapter();

        for (ExcelColumnMap mapping : mappings) {

            if (!BOOK_CHAPTER_ENTITY.equals(
                    mapping.getEntityName())) {
                continue;
            }

            Integer colIndex =
                    headerIndex.get(
                            mapping.getExcelColName()
                    );

            String rawValue =
                    (colIndex != null &&
                     colIndex < cells.size())
                            ? cells.get(colIndex)
                                    .text()
                                    .trim()
                            : "";

            if (rawValue.isEmpty() &&
                    mapping.getDefaultValue() != null) {

                rawValue =
                        mapping.getDefaultValue();
            }

            if (rawValue.isEmpty() &&
                    Boolean.TRUE.equals(
                            mapping.getRequired()
                    )) {

                throw new IllegalArgumentException(
                        "Missing required value for column '"
                        + mapping.getExcelColName()
                        + "'"
                );
            }

            if (!rawValue.isEmpty()) {

                applyFieldValue(
                        bookChapter,
                        mapping.getFieldName(),
                        rawValue
                );
            }
        }

        String deptName =
                bookChapter.getDeptName() == null
                        ? ""
                        : bookChapter.getDeptName()
                                .trim()
                                .toUpperCase();

        if (!allowedDeptNames.contains(deptName)) {

            result.recordSkippedDepartment(
                    bookChapter.getBookChapterTitle(),
                    deptName
            );

            return;
        }

        /*
         * Duplicate check is ONLY on Book Chapter Title,
         * as instructed.
         */
        if (bookChapterRepository.existsByBookChapterTitle(
                bookChapter.getBookChapterTitle()
        )) {

            result.recordSkippedDuplicate(
                    bookChapter.getBookChapterTitle()
            );

            return;
        }

        List<String> authorNames =
                extractAuthorNames(
                        cells,
                        headerIndex
                );

        bookChapterRowPersister.saveRow(
                bookChapter,
                authorNames
        );

        result.recordSaved();
    }

    private void applyFieldValue(
            BookChapter bookChapter,
            String fieldName,
            String rawValue
    ) {

        switch (fieldName) {

            case "sourceId" ->
                    bookChapter.setSourceId(
                            parseLong(
                                    rawValue,
                                    fieldName
                            )
                    );

            case "bookTitle" ->
                    bookChapter.setBookTitle(
                            rawValue
                    );

            case "bookChapterTitle" ->
                    bookChapter.setBookChapterTitle(
                            rawValue
                    );

            case "nameOfBookPublisher" ->
                    bookChapter.setNameOfBookPublisher(
                            rawValue
                    );

            case "month" ->
                    bookChapter.setMonth(
                            parseInt(
                                    rawValue,
                                    fieldName
                            )
                    );

            case "year" ->
                    bookChapter.setYear(
                            parseInt(
                                    rawValue,
                                    fieldName
                            )
                    );

            case "yearOfPublication" ->
                    bookChapter.setYearOfPublication(
                            rawValue
                    );

            case "isbnNo" ->
                    bookChapter.setIsbnNo(
                            rawValue
                    );
            case "fileName" ->
            		bookChapter.setFileName(
            				rawValue
            		);
            	
            case "publicationType" ->
                    bookChapter.setPublicationType(
                            rawValue
                    );

            case "publicationCity" ->
                    bookChapter.setPublicationCity(
                            rawValue
                    );

            case "instituteName" ->
                    bookChapter.setInstituteName(
                            rawValue
                    );

            case "deptName" ->
                    bookChapter.setDeptName(
                            rawValue
                    );

            default ->
                    throw new IllegalStateException(
                            "ExcelColumnMap references field '"
                            + fieldName
                            + "' which does not exist on BookChapter. "
                            + "Check the fieldName value in the "
                            + "ExcelColumnMap table."
                    );
        }
    }

    private Long parseLong(
            String rawValue,
            String fieldName
    ) {

        try {

            return Long.parseLong(
                    rawValue
            );

        } catch (NumberFormatException e) {

            throw new IllegalArgumentException(
                    "Invalid LONG value '"
                    + rawValue
                    + "' for field '"
                    + fieldName
                    + "'"
            );
        }
    }

    private Integer parseInt(
            String rawValue,
            String fieldName
    ) {

        try {

            return Integer.parseInt(
                    rawValue
            );

        } catch (NumberFormatException e) {

            throw new IllegalArgumentException(
                    "Invalid INTEGER value '"
                    + rawValue
                    + "' for field '"
                    + fieldName
                    + "'"
            );
        }
    }

    private List<String> extractAuthorNames(
            Elements cells,
            Map<String, Integer> headerIndex
    ) {

        List<String> authors =
                new ArrayList<>();

        for (int i = 1;
             i <= MAX_AUTHOR_COLUMNS;
             i++) {

            Integer colIndex =
                    headerIndex.get(
                            AUTHOR_COLUMN_PREFIX + i
                    );

            if (colIndex == null ||
                    colIndex >= cells.size()) {
                continue;
            }

            String name =
                    cells.get(colIndex)
                            .text()
                            .trim();

            if (!name.isEmpty() &&
                    !name.equalsIgnoreCase("&nbsp;")) {

                authors.add(name);
            }
        }

        return authors;
    }

    private boolean isRowEmpty(
            Elements cells
    ) {

        for (Element cell : cells) {

            if (!cell.text().trim().isEmpty()) {
                return false;
            }
        }

        return true;
    }
}