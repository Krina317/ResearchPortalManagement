package com.nirma.portal.portal_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class JournalPaperResponseDTO {
	private Long id;
	private String paperTitle;
	private String journalName;
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
	private String instituteName;
	private String deptCode;
}