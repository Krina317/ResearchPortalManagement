package com.nirma.portal.portal_backend.service;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;

/**
 * Summary of what happened during a conference import run.
 * Returned to the controller so it can be shown to the user.
 */
@Getter
public class ConferenceImportResult {

    private int savedCount = 0;
    private final List<String> skippedDuplicateTitles = new ArrayList<>();
    private final List<String> skippedDepartmentRows = new ArrayList<>();

    public void recordSaved() {
        savedCount++;
    }

    public void recordSkippedDuplicate(String paperTitle) {
        skippedDuplicateTitles.add(paperTitle);
    }

    public void recordSkippedDepartment(String paperTitle, String deptCode) {
        skippedDepartmentRows.add(paperTitle + " (dept: " + deptCode + ")");
    }
}