package com.nirma.portal.portal_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "FacultyList")
public class FacultyList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = true)
    private String gender;

    @Column(nullable = false)
    private String designation;

    @Column(nullable = false)
    private String dept;
    
	@Column(nullable = true)
	private String FacultyStatus;
	

    // Backend-only: never sent to the browser.
    @JsonIgnore
    @Column(nullable = true)
    private String scholarId;

    // When we last tried to find this person's Scholar profile by name.
    @JsonIgnore
    @Column(nullable = true)
    private LocalDateTime lastLookupAt;
}