package com.nirma.portal.portal_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NuFundedProjectResponseDTO {
	private Long id;
	private String projectTitle;
	private String principalInvestigator;
	private String coPrincipalInvestigatorList;
	private Long amount;
	private String projectCategory;
	private Long duration;
	private String outcomeOfResearchProject;
	private String publishedPaperDetails;
	private String jointPublicationProof;
	private String ugStudentDetailList;
}
