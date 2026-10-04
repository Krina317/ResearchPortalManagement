package com.nirma.portal.portal_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthorMasterResponseDTO {

    private Long authorId;
    private String displayName;
    private String authorType;
    private boolean needsReview;
}