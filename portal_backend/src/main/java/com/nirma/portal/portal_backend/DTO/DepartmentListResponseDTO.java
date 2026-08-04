package com.nirma.portal.portal_backend.DTO;

import com.nirma.portal.portal_backend.entity.PublicationType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentListResponseDTO {
	private Long id;
	private String deptCode;
	private String deptName;
	private PublicationType publicationType;
	private Boolean active;
}
