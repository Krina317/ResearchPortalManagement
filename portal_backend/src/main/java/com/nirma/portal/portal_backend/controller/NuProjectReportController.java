package com.nirma.portal.portal_backend.controller;

import java.time.LocalDate;
import java.time.ZoneId;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nirma.portal.portal_backend.dto.NuProjectReportDTO;
import com.nirma.portal.portal_backend.entity.ProjectType;
import com.nirma.portal.portal_backend.mapper.NuProjectReportMapper;
import com.nirma.portal.portal_backend.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports/nu-projects")
@CrossOrigin(origins = "http://localhost:3000") // remove if CORS is configured globally
@RequiredArgsConstructor
public class NuProjectReportController {

    private final ProjectRepository projectRepository;
    private final NuProjectReportMapper reportMapper;

    /** GET /api/reports/nu-projects -> Table A, Table 5.11 and detail tables */
    @GetMapping
    public NuProjectReportDTO getReport() {
        return reportMapper.toReport(
                projectRepository.findByProjectType(ProjectType.NuFundedProject),
                projectRepository.findByProjectType(ProjectType.ExternalFundedProject),
                currentAcademicYearStart());
    }

    private int currentAcademicYearStart() {
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        return today.getMonthValue() >= 7 ? today.getYear() : today.getYear() - 1;
    }
}