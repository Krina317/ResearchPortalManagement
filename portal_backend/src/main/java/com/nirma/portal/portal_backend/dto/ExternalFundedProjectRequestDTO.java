package com.nirma.portal.portal_backend.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Positive;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExternalFundedProjectRequestDTO {

    @NotBlank(message = "Project title is required")
    private String projectTitle;

    @NotBlank(message = "Principal investigator is required")
    private String principalInvestigator;

    @NotBlank(message = "Co-principal investigator list is required")
    private String coPrincipalInvestigatorList;

    @NotBlank(message = "Funding agency name is required")
    private String fundingAgencyName;

    @NotNull(message = "Sanctioned amount is required")
    private Long amount;

    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be greater than 0")
    private Double duration;

    @NotBlank(message = "Academic year is required")
    private String academicYear;


    @NotBlank(message = "Outcome of project is required")
    private String outcomeOfProject;

    @NotBlank(message = "Published paper details are required")
    private String publishedPaperDetails;

    @NotBlank(message = "Joint publication proof is required")
    private String jointPublicationProof;

    @NotBlank(message = "Status of the project is required")
    private String statusOfTheProject;
    
    @Size(max = 2000, message = "Remarks cannot exceed 2000 characters")
    private String remarks;

    private LocalDate sanctionedDate;

    @Size(max = 255, message = "Fund received cannot exceed 255 characters")
    private String fundReceived;
}