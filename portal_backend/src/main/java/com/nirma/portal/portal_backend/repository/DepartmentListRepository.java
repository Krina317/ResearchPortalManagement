package com.nirma.portal.portal_backend.repository;

import com.nirma.portal.portal_backend.entity.DepartmentList;
import com.nirma.portal.portal_backend.entity.PublicationType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DepartmentListRepository extends JpaRepository<DepartmentList, Long>{
	List<DepartmentList> findByPublicationTypeAndActiveTrue(PublicationType publicationType);
	Optional<DepartmentList> findByDeptCodeAndPublicationTypeAndActiveTrue(String deptCode, PublicationType publicationType);
	Optional<DepartmentList> findByDeptNameAndPublicationTypeAndActiveTrue(String deptName, PublicationType publicationType);
}
