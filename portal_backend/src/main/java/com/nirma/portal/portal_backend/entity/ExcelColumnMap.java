package com.nirma.portal.portal_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ExcelColumnMap",  indexes = {
        @Index(name = "idx_excel_mapping", columnList = "publicationType")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExcelColumnMap {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PublicationType publicationType;
	
	@Column(nullable = false)
	private String excelColName;
	
	@Column(nullable = false)
	private String entityName;
	
	@Column(nullable = false)
	private String fieldName;
	
	@Column(nullable = false)
	private String dataType;
	
	@Column(nullable = false)
	private Boolean required;
	
	private String defaultValue;
	
	@Column(nullable = false)
	private Boolean enabled;
}
