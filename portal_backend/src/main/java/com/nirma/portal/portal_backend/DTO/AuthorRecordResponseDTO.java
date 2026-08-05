package com.nirma.portal.portal_backend.dto;

import com.nirma.portal.portal_backend.entity.PublicationType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthorRecordResponseDTO {
	private Long id;
	private String normalizedName;
	private String displayName;
	private Long publicationId;
	private PublicationType publicationType;
    private Integer authorPosition;
}	
