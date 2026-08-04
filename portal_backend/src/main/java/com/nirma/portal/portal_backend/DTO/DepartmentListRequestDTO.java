package com.nirma.portal.portal_backend.DTO;

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
public class DepartmentListRequestDTO {
	private String deptCode;
	private String deptName;

	@NotNull(message = "Publication type is required")
	private PublicationType publicationType;

	@NotNull(message = "Active status is required")
	private Boolean active;
}
