package com.nirma.portal.portal_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nirma.portal.portal_backend.entity.FacultyList;

public interface FacultyListRepository extends JpaRepository<FacultyList, Long> {

    Optional<FacultyList> findByNameIgnoreCase(String name);

}