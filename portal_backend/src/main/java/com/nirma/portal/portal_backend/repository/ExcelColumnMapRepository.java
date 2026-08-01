package com.nirma.portal.portal_backend.repository;

import com.nirma.portal.portal_backend.entity.ExcelColumnMap;
import com.nirma.portal.portal_backend.entity.PublicationType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExcelColumnMapRepository extends JpaRepository<ExcelColumnMap, Long>{
	List<ExcelColumnMap> findsByPublicationTypeAndEnabledTrue(PublicationType publicationType);

}
