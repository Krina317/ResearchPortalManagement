package com.nirma.portal.portal_backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExternalFundedProjectResponseDTO {
    private Long id;
    private String projectTitle;
    private String principalInvestigator;
    private String coPrincipalInvestigatorList;
    private String fundingAgencyName;
    private Long amount;
    private Double duration;
    private String academicYear;
    private String outcomeOfProject;
    private String publishedPaperDetails;
    private String jointPublicationProof;
    private String statusOfTheProject;
    private String remarks;
    private LocalDate sanctionedDate;
    private String fundReceived;
}