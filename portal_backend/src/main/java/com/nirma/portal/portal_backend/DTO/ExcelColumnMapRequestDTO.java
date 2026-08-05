package com.nirma.portal.portal_backend.dto;

import com.nirma.portal.portal_backend.entity.PublicationType;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExcelColumnMapRequestDTO {
	
	@NotNull(message = "Need publicationtype")
	private PublicationType publicationType;
	
	@NotBlank(message = "Excel Column name is required")
	private String excelColName;
	
	@NotBlank(message = "Entity name is required")
	private String entityName;
	
	@NotBlank(message = "Filed name is required")
	private String fieldName;
	
	@NotBlank(message = "Data type is required")
	private String dataType;

	@NotNull(message = "Required value is needed")
	private Boolean required;
	
	private String defaultValue;
	
	@NotNull(message = "Enabled is required")
	private Boolean enabled;
}
