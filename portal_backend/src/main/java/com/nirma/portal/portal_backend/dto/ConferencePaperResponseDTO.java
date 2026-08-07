package com.nirma.portal.portal_backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ConferencePaperResponseDTO {
	private Long id;
	private String conferenceName;
	private String conferenceType;
	private String paperTitle;
	private LocalDate fromDate;
	private LocalDate toDate;
	private String instituteName;
	private String deptCode;
}
