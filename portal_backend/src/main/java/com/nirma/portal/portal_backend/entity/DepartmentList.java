package com.nirma.portal.portal_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "DepartmentList",  indexes = {
        @Index(name = "idx_department_publication", columnList = "publicationType")
    })
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentList {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String deptCode;
	
	private String deptName;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PublicationType publicationType;
	
	@Column(nullable = false)
	private Boolean active;
}
