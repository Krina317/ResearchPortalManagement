package com.nirma.portal.portal_backend.service;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;

@Getter
public class ConferenceImportResult {
    private int savedCount = 0;
    private final List<String> skippedDuplicateTitles = new ArrayList<>();
    private final List<String> skippedDepartmentRows = new ArrayList<>();
    private final List<String> skippedErrorRows = new ArrayList<>();

    public void recordSaved() {
        savedCount++;
    }
    public void recordSkippedDuplicate(String paperTitle) {
        skippedDuplicateTitles.add(paperTitle);
    }
    public void recordSkippedDepartment(String paperTitle, String deptCode) {
        skippedDepartmentRows.add(paperTitle + " (dept: " + deptCode + ")");
    }
    public void recordSkippedError(String message) {
        skippedErrorRows.add(message);
    }
}