package com.nirma.portal.portal_backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.nirma.portal.portal_backend.dto.BookChapterSearchCriteria;
import com.nirma.portal.portal_backend.entity.BookChapter;

public interface BookChapterRepositoryCustom {

    Page<BookChapter> search(
            BookChapterSearchCriteria criteria,
            Integer fromTotal,
            Integer toTotal,
            List<Long> authorIds,
            Pageable pageable
    );
}