package com.nirma.portal.portal_backend.service;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
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

import com.nirma.portal.portal_backend.entity.ConferencePaper;
import com.nirma.portal.portal_backend.entity.ExcelColumnMap;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.repository.ConferencePaperRepository;
import com.nirma.portal.portal_backend.repository.DepartmentListRepository;
import com.nirma.portal.portal_backend.repository.ExcelColumnMapRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConferenceImportService {

    private final ConferencePaperRepository conferencePaperRepository;
    private final DepartmentListRepository departmentListRepository;
    private final ExcelColumnMapRepository excelColumnMapRepository;
    private final ConferenceRowPersister conferenceRowPersister;

    private static final List<DateTimeFormatter> DATE_FORMATS = List.of(
            DateTimeFormatter.ofPattern("dd/MM/yyyy"),
            DateTimeFormatter.ofPattern("d/M/yyyy"),
            DateTimeFormatter.ofPattern("dd/MM/yy"),
            DateTimeFormatter.ofPattern("d/M/yy")
    );

    private static final String CONFERENCE_PAPER_ENTITY = "ConferencePaper";
    private static final String AUTHOR_COLUMN_PREFIX = "Author";
    private static final int MAX_AUTHOR_COLUMNS = 10;

    public ConferenceImportResult importConference(MultipartFile file) {
        validateFile(file);

        Document doc = parseHtml(file);
        Element table = doc.selectFirst("table");
        if (table == null) {
            throw new IllegalArgumentException("No table found in uploaded file.");
        }

        Elements rows = table.select("tr");
        if (rows.isEmpty()) {
            throw new IllegalArgumentException("Sheet has no header row.");
        }

        List<ExcelColumnMap> mappings = excelColumnMapRepository
                .findByPublicationTypeAndEnabledTrue(PublicationType.CONFERENCE);

        Set<String> allowedDeptCodes = departmentListRepository
                .findByPublicationTypeAndActiveTrue(PublicationType.CONFERENCE)
                .stream()
                .map(d -> d.getDeptCode().trim().toUpperCase())
                .collect(Collectors.toCollection(HashSet::new));

        Map<String, Integer> headerIndex = validateHeader(rows.get(0), mappings);

        ConferenceImportResult result = new ConferenceImportResult();
        processRows(rows, headerIndex, mappings, allowedDeptCodes, result);
        return result;
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty.");
        }
        String fileName = file.getOriginalFilename();
        if (fileName == null ||
            !(fileName.endsWith(".xls") || fileName.endsWith(".xlsx"))) {
            throw new IllegalArgumentException(
                    "Only Excel (.xls or .xlsx) files are allowed.");
        }
    }

    private Document parseHtml(MultipartFile file) {
        try {
            return Jsoup.parse(file.getInputStream(), "UTF-8", "");
        } catch (Exception e) {
            throw new IllegalArgumentException("Could not read the uploaded file.", e);
        }
    }

    private Map<String, Integer> validateHeader(Element headerRow, List<ExcelColumnMap> mappings) {
        Map<String, Integer> headerIndex = new HashMap<>();
        Elements headerCells = headerRow.select("th");
        if (headerCells.isEmpty()) {
            headerCells = headerRow.select("td");
        }

        int index = 0;
        for (Element cell : headerCells) {
            String header = cell.text().trim();
            if (!header.isEmpty()) {
                headerIndex.put(header, index);
            }
            index++;
        }

        List<String> missing = mappings.stream()
                .filter(m -> Boolean.TRUE.equals(m.getRequired()))
                .map(ExcelColumnMap::getExcelColName)
                .filter(col -> !headerIndex.containsKey(col))
                .toList();

        if (!missing.isEmpty()) {
            throw new IllegalArgumentException(
                    "Missing required column(s) in uploaded file: " + String.join(", ", missing));
        }

        return headerIndex;
    }

    // Each row is now isolated: a bad row is recorded as an error and skipped,
    // it no longer aborts the entire import.
    private void processRows(Elements rows, Map<String, Integer> headerIndex, List<ExcelColumnMap> mappings,
                              Set<String> allowedDeptCodes, ConferenceImportResult result) {
        for (int r = 1; r < rows.size(); r++) {
            Elements cells = rows.get(r).select("td");
            if (cells.isEmpty() || isRowEmpty(cells)) {
                continue;
            }
            try {
                processRow(cells, headerIndex, mappings, allowedDeptCodes, result);
            } catch (Exception e) {
                result.recordSkippedError("Row " + (r + 1) + ": " + e.getMessage());
            }
        }
    }

    private void processRow(Elements cells, Map<String, Integer> headerIndex, List<ExcelColumnMap> mappings,
                             Set<String> allowedDeptCodes, ConferenceImportResult result) {
        ConferencePaper paper = new ConferencePaper();

        for (ExcelColumnMap mapping : mappings) {
            if (!CONFERENCE_PAPER_ENTITY.equals(mapping.getEntityName())) {
                continue;
            }

            Integer colIndex = headerIndex.get(mapping.getExcelColName());
            String rawValue = (colIndex != null && colIndex < cells.size())
                    ? cells.get(colIndex).text().trim()
                    : "";

            if (rawValue.isEmpty() && mapping.getDefaultValue() != null) {
                rawValue = mapping.getDefaultValue();
            }

            if (rawValue.isEmpty() && Boolean.TRUE.equals(mapping.getRequired())) {
                throw new IllegalArgumentException(
                        "Missing required value for column '" + mapping.getExcelColName() + "'");
            }

            setFieldByReflection(paper, mapping.getFieldName(), mapping.getDataType(), rawValue);
        }

        String deptCode = paper.getDeptCode() == null ? "" : paper.getDeptCode().trim().toUpperCase();
        if (!allowedDeptCodes.contains(deptCode)) {
            result.recordSkippedDepartment(paper.getPaperTitle(), deptCode);
            return;
        }

        if (conferencePaperRepository.existsByPaperTitle(paper.getPaperTitle())) {
            result.recordSkippedDuplicate(paper.getPaperTitle());
            return;
        }

        List<String> authorNames = extractAuthorNames(cells, headerIndex);

        conferenceRowPersister.saveRow(paper, authorNames);
        result.recordSaved();
    }

    private void setFieldByReflection(Object target, String fieldName, String dataType, String rawValue) {
        if (rawValue.isEmpty()) {
            return;
        }

        Object convertedValue = convertValue(dataType, rawValue, fieldName);

        try {
            Field field = target.getClass().getDeclaredField(fieldName);
            String setterName = "set" + Character.toUpperCase(fieldName.charAt(0)) + fieldName.substring(1);
            Method setter = target.getClass().getMethod(setterName, field.getType());
            setter.invoke(target, convertedValue);
        } catch (NoSuchFieldException | NoSuchMethodException e) {
            throw new IllegalStateException(
                    "ExcelColumnMap references field '" + fieldName +
                    "' which does not exist on " + target.getClass().getSimpleName() +
                    ". Check the fieldName value in the ExcelColumnMap table.", e);
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException("Failed to set field '" + fieldName + "'", e);
        }
    }

    private Object convertValue(String dataType, String rawValue, String fieldName) {
        String type = dataType == null ? "STRING" : dataType.toUpperCase();
        try {
            return switch (type) {
                case "LONG" -> Long.parseLong(rawValue);
                case "INTEGER" -> Integer.parseInt(rawValue);
                case "DATE" -> parseDateWithFallback(rawValue);
                default -> rawValue;
            };
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException(
                    "Invalid " + type + " value '" + rawValue + "' for field '" + fieldName + "'");
        }
    }

    // Handles BOTH cases you ran into: normal date-strings ("10/07/2025") tried against
    // DATE_FORMATS, and Excel's numeric "serial date" (a plain integer like "45840", which
    // is how a genuine binary .xlsx sometimes represents a date if a cell wasn't formatted
    // as text). If the raw value is purely digits, it's treated as a serial day-count from
    // 1899-12-30 (Excel's date epoch, off-by-one quirk included) instead of a formatted string.
    private LocalDate parseDateWithFallback(String value) {
        if (value.matches("\\d+")) {
            long serial = Long.parseLong(value);
            return LocalDate.of(1899, 12, 30).plusDays(serial);
        }
        for (DateTimeFormatter format : DATE_FORMATS) {
            try {
                return LocalDate.parse(value, format);
            } catch (DateTimeParseException ignored) {
                // try next format
            }
        }
        throw new IllegalArgumentException(
                "Invalid date value: '" + value + "' (tried dd/MM/yyyy, d/M/yyyy, dd/MM/yy, d/M/yy, and Excel serial number)");
    }

    private List<String> extractAuthorNames(Elements cells, Map<String, Integer> headerIndex) {
        List<String> authors = new ArrayList<>();
        for (int i = 1; i <= MAX_AUTHOR_COLUMNS; i++) {
            Integer colIndex = headerIndex.get(AUTHOR_COLUMN_PREFIX + i);
            if (colIndex == null || colIndex >= cells.size()) {
                continue;
            }
            String name = cells.get(colIndex).text().trim();
            if (!name.isEmpty() && !name.equalsIgnoreCase("&nbsp;")) {
                authors.add(name);
            }
        }
        return authors;
    }

    private boolean isRowEmpty(Elements cells) {
        for (Element cell : cells) {
            if (!cell.text().trim().isEmpty()) {
                return false;
            }
        }
        return true;
    }
}