package com.nirma.portal.portal_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "AuthorRecord", indexes = {
        @Index(name = "idx_author_name", columnList = "normalizedName"),
        @Index(name = "idx_publication", columnList = "publicationId"),
        @Index(name = "idx_publication_type", columnList = "publicationType")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthorRecord {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String normalizedName;
	
	@Column(nullable = false)
	private String displayName;
	
	@Column(nullable = false)
	private Long publicationId;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PublicationType publicationType;
	
	@Column(nullable = false)
	private Integer authorPosition;
}
