package com.nirma.portal.portal_backend.dto;
import com.nirma.portal.portal_backend.entity.PublicationType;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PublicationAuthorResponseDTO {

    private Integer authorPosition;

    private AuthorMasterResponseDTO author;

    private Long publicationId;

    private PublicationType publicationType;
    
    private Long id;

    private String studentType;
}