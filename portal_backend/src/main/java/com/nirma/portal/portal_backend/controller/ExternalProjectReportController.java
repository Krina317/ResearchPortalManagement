package com.nirma.portal.portal_backend.controller;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nirma.portal.portal_backend.dto.ExternalProjectReportDTO;
import com.nirma.portal.portal_backend.entity.ProjectType;
import com.nirma.portal.portal_backend.entity.Projects;
import com.nirma.portal.portal_backend.mapper.ExternalProjectReportMapper;
import com.nirma.portal.portal_backend.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports/external-projects")
@RequiredArgsConstructor
public class ExternalProjectReportController {

    private final ProjectRepository projectRepository;
    private final ExternalProjectReportMapper reportMapper;

    /** GET /api/reports/external-projects  ->  all 4 tables, every year in the DB */
    @GetMapping
    public ExternalProjectReportDTO getReport() {
        List<Projects> projects =
                projectRepository.findByProjectType(ProjectType.ExternalFundedProject);

        return reportMapper.toReport(projects, currentAcademicYearStart());
    }

    /** Academic year runs July - June. Oct 2026 -> 2026 (i.e. 2026-2027). */
    private int currentAcademicYearStart() {
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        return today.getMonthValue() >= 7 ? today.getYear() : today.getYear() - 1;
    }
}