package com.nirma.portal.portal_backend.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JournalRequestDTO {

    @NotNull
    private Long sourceId;

    @NotBlank
    private String paperTitle;

    @NotBlank
    private String journalName;

    @NotBlank
    private String journalType;

    @NotBlank
    private String instituteName;

    @NotBlank
    private String deptName;

    private String fileName;
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
    private String downloadFileLink;

    /** Ordered author names; position = index + 1. May be empty, but not missing. */
    @NotNull
    private List<String> authors;
}