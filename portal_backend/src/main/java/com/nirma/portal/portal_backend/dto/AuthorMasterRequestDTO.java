package com.nirma.portal.portal_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthorMasterRequestDTO {
	
	@NotBlank(message = "Display name is required")
    private String displayName;
	
	private String authorType;
}
