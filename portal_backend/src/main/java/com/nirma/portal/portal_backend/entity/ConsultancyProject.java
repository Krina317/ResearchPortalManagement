package com.nirma.portal.portal_backend.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ConsultancyProject",
indexes = {
        @Index(name = "idx_consultancy_sanction_date", columnList = "sanctionDate"),
        @Index(name = "idx_consultancy_status", columnList = "status"),
        @Index(name = "idx_consultancy_agency", columnList = "agencyName")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsultancyProject {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false, length = 500)
	private String title;
	
	@Column(nullable = true)
    private String type;
	
	@Column(nullable = false)
	private String status;
	 
	@Column(nullable = false)
	private String agencyName;
	 
	@Column(nullable = false)
	private LocalDate sanctionDate;
	 
	@Column(nullable = false, precision = 14, scale = 2)
	private BigDecimal sanctionedAmount;
	 
	private LocalDate startDate;
	private LocalDate endDate;
	
	@CreationTimestamp
	@Column(updatable = false)
	private LocalDateTime createdAt;
	
	@UpdateTimestamp
	private LocalDateTime updatedAt;
}
