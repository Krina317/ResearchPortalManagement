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
import com.nirma.portal.portal_backend.entity.JournalPaper;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.repository.DepartmentListRepository;
import com.nirma.portal.portal_backend.repository.ExcelColumnMapRepository;
import com.nirma.portal.portal_backend.repository.JournalPaperRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JournalImportService {

    private final JournalPaperRepository journalPaperRepository;
    private final DepartmentListRepository departmentListRepository;
    private final ExcelColumnMapRepository excelColumnMapRepository;
    private final JournalRowPersister journalRowPersister;

    private static final String JOURNAL_PAPER_ENTITY = "JournalPaper";
    private static final String AUTHOR_COLUMN_PREFIX = "Author";
    private static final int MAX_AUTHOR_COLUMNS = 10;

    // The "Download File" column's cell content is just the literal text
    // "Click Here" (an <a> tag) — the real value is in that anchor's href,
    // not its text. This is the field name that column maps to in
    // ExcelColumnMap; special-cased below wherever it's referenced.
    private static final String DOWNLOAD_LINK_FIELD = "downloadFileLink";

    public JournalImportResult importJournal(MultipartFile file) {
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

        //col mappings
        List<ExcelColumnMap> mappings = excelColumnMapRepository
                .findByPublicationTypeAndEnabledTrue(PublicationType.JOURNAL);

        Map<String, Integer> headerIndex = validateHeader(rows.get(0), mappings);

        //dept filtering 
        List<DepartmentList> departments = departmentListRepository
                .findByPublicationTypeAndActiveTrue(PublicationType.JOURNAL);

        Set<String> allowedDeptNames = departments.stream()
                .map(d -> d.getDeptName().trim().toUpperCase())
                .collect(Collectors.toCollection(HashSet::new));

        JournalImportResult result = new JournalImportResult();
        processRows(rows, headerIndex, mappings, allowedDeptNames, result);
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

    // Each row is isolated: a bad row is recorded as an error and skipped,
    // it does not abort the entire import.
    private void processRows(Elements rows, Map<String, Integer> headerIndex, List<ExcelColumnMap> mappings,Set<String> allowedDeptNames, JournalImportResult result) {
		for (int r = 1; r < rows.size(); r++) {
			Element rowElement = rows.get(r);
			Elements cells = rowElement.select("td");
			if (cells.isEmpty() || isRowEmpty(cells)) {
				continue;}
			try {
				processRow(rowElement, cells, headerIndex, mappings, allowedDeptNames, result);
			} catch (Exception e) {
				result.recordSkippedError("Row " + (r + 1) + ": " + e.getMessage());
			}
		}
	}
		
	private void processRow(Element rowElement, Elements cells, Map<String, Integer> headerIndex,List<ExcelColumnMap> mappings, Set<String> allowedDeptNames,JournalImportResult result) {
		JournalPaper paper = new JournalPaper();
		
		for (ExcelColumnMap mapping : mappings) {
			if (!JOURNAL_PAPER_ENTITY.equals(mapping.getEntityName())) {
				continue;
		}
	
		String rawValue = extractRawValue(rowElement, cells, headerIndex, mapping);
		
		if (rawValue.isEmpty() && mapping.getDefaultValue() != null) {
			rawValue = mapping.getDefaultValue();
		}
		
		if (rawValue.isEmpty() && Boolean.TRUE.equals(mapping.getRequired())) {
			throw new IllegalArgumentException(
			      "Missing required value for column '" + mapping.getExcelColName() + "'");
		}
	
		if (!rawValue.isEmpty()) {
            applyFieldValue(paper, mapping.getFieldName(), rawValue);
        }
	}
		
		String deptName = paper.getDeptName() == null ? "" : paper.getDeptName().trim().toUpperCase();
		if (!allowedDeptNames.contains(deptName)) {
			result.recordSkippedDepartment(paper.getPaperTitle(), deptName);
			return;
		}
		
		if (journalPaperRepository.existsByPaperTitle(paper.getPaperTitle())) {
			result.recordSkippedDuplicate(paper.getPaperTitle());
			return;
		}
		
		List<String> authorNames = extractAuthorNames(cells, headerIndex);
		
		journalRowPersister.saveRow(paper, authorNames);
		result.recordSaved();
	}
    /**
     * Reads the raw cell text for a mapped column, except for the download-link
     * field, which is special-cased: its cell content is just "Click Here" text,
     * the real value lives in that <a> tag's href. Rather than trusting the
     * mapped column index (fragile if the report's HTML nests oddly), we find
     * the row's hyperlink directly by its id pattern, which ASP.NET assigns
     * uniquely per row (HyperLink1_0, HyperLink1_1, ...).
     */
	
	private void applyFieldValue(JournalPaper paper, String fieldName, String rawValue) {
        switch (fieldName) {
            case "fileName" -> paper.setFileName(rawValue);
            case "sourceId" -> paper.setSourceId(parseLong(rawValue, fieldName));
            case "paperTitle" -> paper.setPaperTitle(rawValue);
            case "journalName" -> paper.setJournalName(rawValue);
            case "journalType" -> paper.setJournalType(rawValue);
            case "impactFactorClarivate" -> paper.setImpactFactorClarivate(rawValue);
            case "impactFactorJournal" -> paper.setImpactFactorJournal(rawValue);
            case "yearOfPublication" -> paper.setYearOfPublication(parseInt(rawValue, fieldName));
            case "monthOfPublication" -> paper.setMonthOfPublication(rawValue);
            case "indexIn" -> paper.setIndexIn(rawValue);
            case "issnNo" -> paper.setIssnNo(rawValue);
            case "volumeNo" -> paper.setVolumeNo(rawValue);
            case "issueNo" -> paper.setIssueNo(rawValue);
            case "pageNo" -> paper.setPageNo(rawValue);
            case "websiteJournalLink" -> paper.setWebsiteJournalLink(rawValue);
            case "articleLink" -> paper.setArticleLink(rawValue);
            case "doiNumber" -> paper.setDoiNumber(rawValue);
            case "instituteName" -> paper.setInstituteName(rawValue);
            case "deptName" -> paper.setDeptName(rawValue);
            case "downloadFileLink" -> paper.setDownloadFileLink(rawValue);
            default -> throw new IllegalStateException(
                    "ExcelColumnMap references field '" + fieldName +
                    "' which does not exist on JournalPaper. Check the fieldName value in the ExcelColumnMap table.");
        }
    }
	
    private String extractRawValue(Element rowElement, Elements cells, Map<String, Integer> headerIndex,
                                    ExcelColumnMap mapping) {
        if (DOWNLOAD_LINK_FIELD.equals(mapping.getFieldName())) {
            Element linkEl = rowElement.selectFirst("a[href][id*=HyperLink]");
            return linkEl != null ? linkEl.attr("href").trim() : "";
        }

        Integer colIndex = headerIndex.get(mapping.getExcelColName());
        return (colIndex != null && colIndex < cells.size())
                ? cells.get(colIndex).text().trim()
                : "";
    }

    private Long parseLong(String rawValue, String fieldName) {
        try {
            return Long.parseLong(rawValue);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid LONG value '" + rawValue + "' for field '" + fieldName + "'");
        }
    }

    private Integer parseInt(String rawValue, String fieldName) {
        try {
            return Integer.parseInt(rawValue);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid INTEGER value '" + rawValue + "' for field '" + fieldName + "'");
        }
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