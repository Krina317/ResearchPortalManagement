package com.nirma.portal.portal_backend.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConferenceListItemDTO {
    private Long id;
    private Long sourceId;
    private String conferenceName;
    private String conferenceType;
    private String paperTitle;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String instituteName;
    private String deptCode;

    private List<AuthorRecordResponseDTO> authors;  // ordered by authorPosition
    private String authorsMerged;                   // "A, B, C" convenience field
}