package com.nirma.portal.portal_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewAuthorDTO {
    private Long authorId;
    private String displayName;
    private String authorType;          // "NU" or null
    private String matchReason;
    private Long suggestedFacultyId;
    private String suggestedFacultyName;
}