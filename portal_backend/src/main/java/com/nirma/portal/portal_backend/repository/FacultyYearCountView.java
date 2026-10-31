package com.nirma.portal.portal_backend.repository;

public interface FacultyYearCountView {
    Long getFacultyId();
    String getFacultyName();
    String getFacultyStatus();
    Long getAcademicYear();   // start year: 2025 means 2025-26
    Long getPaperCount();
}