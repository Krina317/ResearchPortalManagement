package com.nirma.portal.portal_backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.nirma.portal.portal_backend.dto.ConferenceSearchCriteria;
import com.nirma.portal.portal_backend.entity.ConferencePaper;

public interface ConferencePaperRepositoryCustom {

    Page<ConferencePaper> search(
            ConferenceSearchCriteria criteria,
            LocalDate fromDate,
            LocalDate toDate,
            List<Long> authorIds,
            Pageable pageable
    );
}