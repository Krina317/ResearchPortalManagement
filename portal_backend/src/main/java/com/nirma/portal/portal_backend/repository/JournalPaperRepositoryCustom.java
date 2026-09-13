package com.nirma.portal.portal_backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.nirma.portal.portal_backend.dto.JournalSearchCriteria;
import com.nirma.portal.portal_backend.entity.JournalPaper;

public interface JournalPaperRepositoryCustom {

    Page<JournalPaper> search(
            JournalSearchCriteria criteria,
            Integer fromTotal,
            Integer toTotal,
            List<String> indexInTags,
            List<Long> authorIds,
            Pageable pageable
    );
}