package com.nirma.portal.portal_backend.repository;

import com.nirma.portal.portal_backend.entity.FacultyList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FacultyListRepository extends JpaRepository<FacultyList, Long> {

    List<FacultyList> findByScholarIdIsNull();
}