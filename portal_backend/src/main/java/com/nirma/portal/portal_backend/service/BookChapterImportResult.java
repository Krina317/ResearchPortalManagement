package com.nirma.portal.portal_backend.service;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;

@Getter
public class BookChapterImportResult {

    private int savedCount = 0;

    private final List<String> skippedDuplicateTitles = new ArrayList<>();

    private final List<String> skippedDepartmentRows = new ArrayList<>();

    private final List<String> skippedErrorRows = new ArrayList<>();

    public void recordSaved() {
        savedCount++;
    }

    public void recordSkippedDuplicate(String bookChapterTitle) {
        skippedDuplicateTitles.add(bookChapterTitle);
    }

    public void recordSkippedDepartment(String bookChapterTitle, String deptName) {
        skippedDepartmentRows.add(
                bookChapterTitle + " (dept: " + deptName + ")"
        );
    }

    public void recordSkippedError(String message) {
        skippedErrorRows.add(message);
    }
}