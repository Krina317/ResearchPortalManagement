package com.nirma.portal.portal_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConferenceFacultyResponseDTO {
    private Long facultyId;
    private String facultyName;
    private Double conferenceScore;
}