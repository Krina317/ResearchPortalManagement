package com.nirma.portal.portal_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "JournalPaper", indexes = {
        @Index(name = "idx_journal_paper_title", columnList = "paperTitle"),
        @Index(name = "idx_journal_department", columnList = "deptCode"),
        @Index(name = "idx_journal_name", columnList = "journalName"),
        @Index(name = "idx_journal_index_in", columnList = "indexIn")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JournalPaper {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String fileName;
	
	@Column(nullable = false)
	private Long sourceId;

	@Column(nullable = false, length = 500)
	private String paperTitle;

	@Column(nullable = false)
	private String journalName;

	@Column(nullable = false)
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

	@Column(nullable = false)
	private String instituteName;

	@Column(nullable = false)
	private String deptCode;
	
	private String downloadFileLink;
}