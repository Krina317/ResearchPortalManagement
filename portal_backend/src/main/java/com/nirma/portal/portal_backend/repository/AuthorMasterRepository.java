package com.nirma.portal.portal_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nirma.portal.portal_backend.entity.AuthorMaster;

public interface AuthorMasterRepository extends JpaRepository<AuthorMaster, Long>{
	Optional<AuthorMaster> findByNormalizedName(String normalizedName);
	List<AuthorMaster> findByNormalizedNameContainingIgnoreCase(String normalizedName);

}
