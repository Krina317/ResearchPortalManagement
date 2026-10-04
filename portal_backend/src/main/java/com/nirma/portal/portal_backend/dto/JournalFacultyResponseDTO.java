package com.nirma.portal.portal_backend.dto;

import lombok.*;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
public class JournalFacultyResponseDTO {
	private Long facultyId;
	private String facultyName;
	private Double journalScore;
}
