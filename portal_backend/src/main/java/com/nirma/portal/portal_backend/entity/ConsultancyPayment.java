package com.nirma.portal.portal_backend.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import lombok.*;

/** One row of the ledger = one payment received against a project. */
@Entity
@Table(
	name = "ConsultancyPayment",
	indexes = {
		@Index(name = "idx_consultancy_payment_received_on", columnList = "receivedOn"),
		@Index(name = "idx_consultancy_payment_project", columnList = "project_id")
	}
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsultancyPayment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "project_id", nullable = false)
	private ConsultancyProject project;

	@Column(nullable = false)
	private LocalDate receivedOn;

	@Column(nullable = false, precision = 14, scale = 2)
	private BigDecimal amount;

	@Column(unique = true, nullable = true)
	private String voucherRef;

	@Column(nullable = true)
	private String note;

	@Column(nullable = true)
	private String proofUrl;

	@CreationTimestamp
	@Column(updatable = false)
	private LocalDateTime createdAt;
}