package com.nirma.portal.portal_backend.repository;

import com.nirma.portal.portal_backend.entity.ExternalFundedProject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExternalFundedProjectRepository extends JpaRepository<ExternalFundedProject, Long> {
    boolean existsByProjectTitle(String projectTitle);
}