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
public class NuFundedProjectRequestDTO {

	@NotBlank(message = "Project title is required")
	private String projectTitle;
	
	@NotBlank(message = "Principal investigator is required")
	private String principalInvestigator;
	
	@NotBlank(message = "Co-principal investigator list is required")
	private String coPrincipalInvestigatorList;
	
	@NotNull(message = "Amount is required")
	private Long amount;
	
	@NotBlank(message = "Project category is required")
	private String projectCategory;
	
	@NotNull(message = "Duration is required")
	private Long duration;
	
	@NotBlank(message = "Academic year is required")
	private String academicYear;
//	
//	@NotNull(message = "From date is required")
//	private LocalDate fromDate;
//	
//	@NotNull(message = "To date is required")
//	private LocalDate toDate;
//	
	
	private String outcomeOfResearchProject;
	private String publishedPaperDetails;
	
	@NotBlank(message = "Joint publication proof is required")
	private String jointPublicationProof;
	
	private String ugStudentDetailList;
	
	
}
