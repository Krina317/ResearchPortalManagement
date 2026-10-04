package com.nirma.portal.portal_backend.entity;

import java.time.LocalDateTime;

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
@Table(name = "ProjectInvitations")
public class ProjectInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String facultyEmail;

    // Which form the faculty member will fill in (Nu or External)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectType projectType;

    // SHA-256 of the token as 64 hex characters. The token itself is never stored.
    @Column(nullable = false, unique = true, length = 64)
    private String tokenHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvitationStatus status = InvitationStatus.PENDING;

    // null until the first attempt to send the email
    @Enumerated(EnumType.STRING)
    private EmailStatus emailStatus;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    // set when the faculty member submits the form
    private LocalDateTime submittedAt;

    // id of the Projects row created from the submission
    private Long projectId;

    @PrePersist
    private void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}