package com.nirma.portal.portal_backend.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Projects")
public class Projects {

    private static final String NIRMA_AGENCY = "Nirma";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 500)
    private String projectTitle;

    @Column(nullable = false)
    private String principalInvestigator;

    @Column(nullable = false,length = 2000)
    private String coPrincipalInvestigatorList;

    // amount (Nu) / amountTotalSanctioned (External)
    @Column(nullable = false)
    private Long amount;

    @Column(nullable = false)
    private Long duration;

    @Column(nullable = false)
    private String academicYear;

    @Column(nullable = false)
    private LocalDate fromDate;

    @Column(nullable = false)
    private LocalDate toDate;

    // outcomeOfResearchProject (Nu) / outcomeOfProject (External)
    @Column(nullable = false)
    private String outcomeOfProject;

    @Column(nullable = false, length = 2000)
    private String publishedPaperDetails;

    @Column(nullable = false,length = 2000)
    private String jointPublicationProof;

    // Nu projects: always "Nirma" (set automatically)
    // External projects: entered by the user
    @Column(nullable = false)
    private String fundingAgencyName = "Nirma";

    // Only for NuFundedProject (null for external) - validate in DTO
    private String nuProjectCategory;

    // Only for ExternalFundedProject (null for Nu) - validate in DTO
    private String statusOfTheProject;

    // Only for NuFundedProject - validate in DTO
    @Column(length = 2000)
    private String ugStudentDetailList;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectType projectType;

    @PrePersist
    @PreUpdate
    private void applyDefaults() {
        if (projectType == ProjectType.NuFundedProject) {
            this.fundingAgencyName = NIRMA_AGENCY;
        }
    }
}