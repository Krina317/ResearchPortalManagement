package com.nirma.portal.portal_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
	name = "ConsultancyFaculty",
	uniqueConstraints = @UniqueConstraint(
			name = "consultancy_faculty_unique",
			columnNames = {"project_id","faculty_id"}),
	indexes = {
		@Index(name = "idx_cpf_project", columnList = "project_id"),
		@Index(name = "idx_cpf_faculty", columnList = "faculty_id")
	}
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsultancyFaculty {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "project_id", nullable = false)
	private ConsultancyProject project;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "faculty_id", nullable = false)
	private FacultyList faculty;

	/** 1 = first listed. Reports print names in this order. */
	@Column(nullable = false)
	private Integer sortOrder;
}