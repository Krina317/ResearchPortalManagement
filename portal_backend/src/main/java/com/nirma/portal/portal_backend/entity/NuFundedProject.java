package com.nirma.portal.portal_backend.entity;


import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "NuFundedProject")
public class NuFundedProject {
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
	private Long amount;
	
	@Column(nullable = false)
	private String projectCategory;
	
	@Column(nullable = false)
	private Long duration;
	
	private String outcomeOfResearchProject;
	
	private String publishedPaperDetails; 
	
	@Column(nullable = false)
	private String jointPublicationProof;
	
	private String ugStudentDetailList;
}
