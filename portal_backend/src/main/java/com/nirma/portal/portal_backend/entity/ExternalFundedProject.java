package com.nirma.portal.portal_backend.entity;


import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ExternalFundedProject")
public class ExternalFundedProject {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false, unique = true, length = 500)
	private String projectTitle;
	
	@Column(nullable = false)
	private String principalInvestigator;
	
	@Column(nullable = false)
	private String coPrincipalInvestigatorList;
	
	@Column(nullable = false)
	private String fundingAgencyName;
	
	@Column(nullable = false)
	private Long amountTotalSanctioned;
	
	@Column(nullable = false)
	private Long duration;
	
	@Column(nullable = false)
	private String academicYear;
	
	@Column(nullable = false)
	private LocalDate fromDate;
	
	@Column(nullable = false)
	private LocalDate toDate;
	
	private String outcomeOfProject;
	
	private String publishedPaperDetails; 
	
	@Column(nullable = false)
	private String jointPublicationProof;
	
	@Column(nullable = false)
	private String statusOfTheProject;

}
