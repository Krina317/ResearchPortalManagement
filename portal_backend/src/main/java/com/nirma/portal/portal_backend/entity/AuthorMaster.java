package com.nirma.portal.portal_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "AuthorMaster", indexes = {
		 @Index(name = "idx_author_name", columnList = "normalizedName"),
		 @Index(name = "idx_author_type", columnList = "authorType")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthorMaster {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long authorId;
	
	@Column(nullable = false)
	private String normalizedName;
	
	@Column(nullable = false)
	private String displayName;
	
	@Column
	private String authorType;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "faculty_id")
	private FacultyList faculty;

	@Column(nullable = false)
	private boolean needsReview = false;

	@Column(length = 500)
	private String matchReason;

	@Column(nullable = false)
	private boolean manuallyVerified = false;
	
}
