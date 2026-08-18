package com.nirma.portal.portal_backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class JournalPaperRequestDTO {
	@NotNull(message = "ID is required")
	private Long id;

	@NotBlank(message = "Paper title is required")
	private String paperTitle;

	@NotBlank(message = "Journal name is required")
	private String journalName;

	@NotBlank(message = "Journal type is required")
	private String journalType;

	private String impactFactorClarivate;
	private String impactFactorJournal;
	private Integer yearOfPublication;
	private String monthOfPublication;
	private String indexIn;
	private String issnNo;
	private String volumeNo;
	private String issueNo;
	private String pageNo;
	private String websiteJournalLink;
	private String articleLink;
	private String doiNumber;
	private String fileName;

	@NotBlank(message = "Institute name is required")
	private String instituteName;

	@NotBlank(message = "Department code is required")
	private String deptCode;
}