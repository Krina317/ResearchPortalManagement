package com.nirma.portal.portal_backend.DTO;

import com.nirma.portal.portal_backend.entity.PublicationType;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthorRecordRequestDTO {
	
	@NotBlank(message = "Display name is required")
    private String displayName;

    @NotNull(message = "Publication ID is required")
    private Long publicationId;

    @NotNull(message = "Publication type is required")
    private PublicationType publicationType;

    @NotNull(message = "Author position is required")
    private Integer authorPosition;
	
}
