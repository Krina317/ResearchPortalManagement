package com.nirma.portal.portal_backend.dto;

import com.nirma.portal.portal_backend.entity.PublicationType;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PublicationAuthorRequestDTO {

    @NotNull
    private Long authorId;

    @NotNull
    private Long publicationId;

    @NotNull
    private PublicationType publicationType;

    @NotNull
    private Integer authorPosition;
}