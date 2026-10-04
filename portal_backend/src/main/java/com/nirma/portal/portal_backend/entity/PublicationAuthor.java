package com.nirma.portal.portal_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PublicationAuthor",indexes = {
		@Index(name = "idx_publication", columnList = "publicationId"),
        @Index(name = "idx_publication_type", columnList = "publicationType"),
        @Index(name = "idx_author", columnList = "author_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PublicationAuthor {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id", nullable = false)
    private AuthorMaster author;
	
	@Column(nullable = false)
	private Long publicationId;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PublicationType publicationType;
	
	@Column(nullable = false)
	private Integer authorPosition;
	
	@Column(length = 10)
	private String studentType;
}
