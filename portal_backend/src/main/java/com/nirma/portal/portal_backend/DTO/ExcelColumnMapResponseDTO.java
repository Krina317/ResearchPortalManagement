package com.nirma.portal.portal_backend.DTO;

import com.nirma.portal.portal_backend.entity.PublicationType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExcelColumnMapResponseDTO {
	private Long id;
	private PublicationType publicationType;
	private String excelColName;
	private String entityName;
	private String fieldName;
	private String dataType;
	private Boolean required;
	private String defaultValue;
	private Boolean enabled;
}
