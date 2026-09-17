package com.nirma.portal.portal_backend.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
	private Long amountTotalSanctioned;
	
	@NotNull(message = "Duration is required")
	private Long duration;
	
	@NotBlank(message = "Academic year is required")
	private String academicYear;
	
	@NotNull(message = "From date is required")
	private LocalDate fromDate;
	
	@NotNull(message = "To date is required")
	private LocalDate toDate;
	
	private String outcomeOfProject;
	private String publishedPaperDetails;
	
	@NotBlank(message = "Joint publiation proof is required")
	private String jointPublicationProof;
	
	@NotBlank(message = "Status pf the project is required")
	private String statusOfTheProject;
}
