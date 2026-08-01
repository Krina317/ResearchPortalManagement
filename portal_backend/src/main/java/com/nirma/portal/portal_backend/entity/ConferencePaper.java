package com.nirma.portal.portal_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "ConferencePaper", indexes = {@Index(name = "idx_conference_paper_title", columnList = "paperTitle"), 
											@Index(name = "idx_conference_department", columnList = "deptCode"), 
											@Index(name = "idx_conference_from_date", columnList = "fromDate"),
											@Index(name = "idex_conference_to_date", columnList = "toDate"),
											@Index(name = "idx_conference_name", columnList = "conferenceName")
											}
		)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConferencePaper {
	@Id
	@Column(nullable = false)
	private Long id;
	
	@Column(nullable = false)
	private String conferenceName;
	
	@Column(nullable = false)
	private String conferenceType;
	
	@Column(nullable = false, unique = true, length = 500)
	private String paperTitle;
	
	private LocalDate fromDate;
	private LocalDate toDate;
	
	@Column(nullable = false)
	private String instituteName;
	
	@Column(nullable = false)
	private String deptCode;
}
