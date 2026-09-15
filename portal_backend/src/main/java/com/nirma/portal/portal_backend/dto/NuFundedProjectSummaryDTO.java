package com.nirma.portal.portal_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor 
@NoArgsConstructor
public class NuFundedProjectSummaryDTO {

    private String academicYear;

    // All projects running during this academic year
    private Long totalProjects;

    // Only projects sanctioned/started in this academic year
    private Long sanctionedProjects;

    // Only amount sanctioned in this academic year
    private Long sanctionedAmount;
}