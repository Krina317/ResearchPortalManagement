package com.nirma.portal.portal_backend.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.dto.AuthorRecordResponseDTO;
import com.nirma.portal.portal_backend.dto.ColumnMetaDTO;
import com.nirma.portal.portal_backend.dto.ConferenceListItemDTO;
import com.nirma.portal.portal_backend.dto.ConferenceSearchCriteria;
import com.nirma.portal.portal_backend.entity.AuthorRecord;
import com.nirma.portal.portal_backend.entity.ConferencePaper;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.exception.ConferencePaperNotFoundException;
import com.nirma.portal.portal_backend.mapper.AuthorRecordMapper;
import com.nirma.portal.portal_backend.repository.AuthorRecordRepository;
import com.nirma.portal.portal_backend.repository.ConferencePaperRepository;
import com.nirma.portal.portal_backend.repository.ExcelColumnMapRepository;
import com.nirma.portal.portal_backend.specification.AuthorRecordSpecifications;
import com.nirma.portal.portal_backend.specification.ConferencePaperSpecifications;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConferenceQueryService {

    private final ConferencePaperRepository conferencePaperRepository;
    private final AuthorRecordRepository authorRecordRepository;
    private final ExcelColumnMapRepository excelColumnMapRepository;
    private final AuthorRecordMapper authorRecordMapper;

    @Transactional(readOnly = true)
    public Page<ConferenceListItemDTO> search(ConferenceSearchCriteria criteria, Pageable pageable) {
        Specification<ConferencePaper> spec = ConferencePaperSpecifications.build(criteria);

        boolean hasAuthorFilter = notBlank(criteria.getAuthorName())
                || (criteria.getAuthorPositions() != null && !criteria.getAuthorPositions().isEmpty());

        if (hasAuthorFilter) {
            List<Long> matchingPaperIds = authorRecordRepository
                    .findAll(AuthorRecordSpecifications.build(
                            PublicationType.CONFERENCE, criteria.getAuthorName(), criteria.getAuthorPositions()))
                    .stream()
                    .map(AuthorRecord::getPublicationId)
                    .distinct()
                    .toList();

            if (matchingPaperIds.isEmpty()) {
                return Page.empty(pageable);
            }
            spec = spec.and(ConferencePaperSpecifications.idIn(matchingPaperIds));
        }

        Page<ConferencePaper> page = conferencePaperRepository.findAll(spec, pageable);

        // Batch-fetch authors for every paper on this page in ONE query (avoids N+1).
        List<Long> pageIds = page.getContent().stream().map(ConferencePaper::getId).toList();
        Map<Long, List<AuthorRecord>> authorsByPaperId = fetchAuthorsFor(pageIds);

        return page.map(paper -> toListItem(paper, authorsByPaperId));
    }

    @Transactional(readOnly = true)
    public ConferenceListItemDTO getById(Long id) {
        ConferencePaper paper = conferencePaperRepository.findById(id)
                .orElseThrow(() -> new ConferencePaperNotFoundException("Conference paper " + id + " not found"));
        return toListItem(paper, fetchAuthorsFor(List.of(id)));
    }

    @Transactional(readOnly = true)
    public List<ColumnMetaDTO> getColumns() {
        List<ColumnMetaDTO> columns = excelColumnMapRepository
                .findByPublicationTypeAndEnabledTrue(PublicationType.CONFERENCE)
                .stream()
                .filter(m -> "ConferencePaper".equals(m.getEntityName()))
                .map(m -> new ColumnMetaDTO(m.getFieldName(), m.getExcelColName()))
                .collect(Collectors.toList());
        columns.add(new ColumnMetaDTO("authors", "Authors"));
        return columns;
    }

    // -- helpers --

    private Map<Long, List<AuthorRecord>> fetchAuthorsFor(List<Long> paperIds) {
        if (paperIds.isEmpty()) {
            return Map.of();
        }
        return authorRecordRepository
                .findByPublicationIdInAndPublicationTypeOrderByAuthorPositionAsc(paperIds, PublicationType.CONFERENCE)
                .stream()
                .collect(Collectors.groupingBy(AuthorRecord::getPublicationId));
    }

    private ConferenceListItemDTO toListItem(ConferencePaper paper, Map<Long, List<AuthorRecord>> authorsByPaperId) {
        List<AuthorRecord> authorEntities = authorsByPaperId.getOrDefault(paper.getId(), List.of())
                .stream()
                .sorted(Comparator.comparing(AuthorRecord::getAuthorPosition))
                .toList();

        List<AuthorRecordResponseDTO> authorDtos = authorRecordMapper.toResponseDTOList(authorEntities);
        String merged = authorEntities.stream()
                .map(AuthorRecord::getDisplayName)
                .collect(Collectors.joining(", "));

        return new ConferenceListItemDTO(
                paper.getId(), paper.getSourceId(), paper.getConferenceName(), paper.getConferenceType(),
                paper.getPaperTitle(), paper.getFromDate(), paper.getToDate(), paper.getInstituteName(),
                paper.getDeptCode(), authorDtos, merged
        );
    }

    private boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }
}