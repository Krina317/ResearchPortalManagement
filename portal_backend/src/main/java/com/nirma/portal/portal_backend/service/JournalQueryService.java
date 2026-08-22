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
import com.nirma.portal.portal_backend.dto.JournalListItemDTO;
import com.nirma.portal.portal_backend.dto.JournalSearchCriteria;
import com.nirma.portal.portal_backend.entity.AuthorRecord;
import com.nirma.portal.portal_backend.entity.JournalPaper;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.exception.JournalPaperNotFoundException;
import com.nirma.portal.portal_backend.mapper.AuthorRecordMapper;
import com.nirma.portal.portal_backend.repository.AuthorRecordRepository;
import com.nirma.portal.portal_backend.repository.ExcelColumnMapRepository;
import com.nirma.portal.portal_backend.repository.JournalPaperRepository;
import com.nirma.portal.portal_backend.specification.AuthorRecordSpecifications;
import com.nirma.portal.portal_backend.specification.JournalPaperSpecifications;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JournalQueryService {

    private final JournalPaperRepository journalPaperRepository;
    private final AuthorRecordRepository authorRecordRepository;
    private final ExcelColumnMapRepository excelColumnMapRepository;
    private final AuthorRecordMapper authorRecordMapper;

    @Transactional(readOnly = true)
    public Page<JournalListItemDTO> search(JournalSearchCriteria criteria, Pageable pageable) {
        Specification<JournalPaper> spec = JournalPaperSpecifications.build(criteria);

        boolean hasAuthorFilter = notBlank(criteria.getAuthorName())
                || (criteria.getAuthorPositions() != null && !criteria.getAuthorPositions().isEmpty());

        if (hasAuthorFilter) {
            List<Long> matchingPaperIds = authorRecordRepository
                    .findAll(AuthorRecordSpecifications.build(
                            PublicationType.JOURNAL, criteria.getAuthorName(), criteria.getAuthorPositions()))
                    .stream()
                    .map(AuthorRecord::getPublicationId)
                    .distinct()
                    .toList();

            if (matchingPaperIds.isEmpty()) {
                return Page.empty(pageable);
            }
            spec = spec.and(JournalPaperSpecifications.idIn(matchingPaperIds));
        }

        Page<JournalPaper> page = journalPaperRepository.findAll(spec, pageable);

        List<Long> pageIds = page.getContent().stream().map(JournalPaper::getId).toList();
        Map<Long, List<AuthorRecord>> authorsByPaperId = fetchAuthorsFor(pageIds);

        return page.map(paper -> toListItem(paper, authorsByPaperId));
    }

    @Transactional(readOnly = true)
    public JournalListItemDTO getById(Long id) {
        JournalPaper paper = journalPaperRepository.findById(id)
                .orElseThrow(() -> new JournalPaperNotFoundException("Journal paper " + id + " not found"));
        return toListItem(paper, fetchAuthorsFor(List.of(id)));
    }

    @Transactional(readOnly = true)
    public List<ColumnMetaDTO> getColumns() {
        List<ColumnMetaDTO> columns = excelColumnMapRepository
                .findByPublicationTypeAndEnabledTrue(PublicationType.JOURNAL)
                .stream()
                .filter(m -> "JournalPaper".equals(m.getEntityName()))
                .map(m -> new ColumnMetaDTO(m.getFieldName(), m.getExcelColName()))
                .collect(Collectors.toList());
        columns.add(new ColumnMetaDTO("authors", "Authors"));
        return columns;
    }

    @Transactional(readOnly = true)
    public long getTotalCount() {
        return journalPaperRepository.count();
    }

    // -- helpers --

    private Map<Long, List<AuthorRecord>> fetchAuthorsFor(List<Long> paperIds) {
        if (paperIds.isEmpty()) {
            return Map.of();
        }
        return authorRecordRepository
                .findByPublicationIdInAndPublicationTypeOrderByAuthorPositionAsc(paperIds, PublicationType.JOURNAL)
                .stream()
                .collect(Collectors.groupingBy(AuthorRecord::getPublicationId));
    }

    private JournalListItemDTO toListItem(JournalPaper paper, Map<Long, List<AuthorRecord>> authorsByPaperId) {
        List<AuthorRecord> authorEntities = authorsByPaperId.getOrDefault(paper.getId(), List.of())
                .stream()
                .sorted(Comparator.comparing(AuthorRecord::getAuthorPosition))
                .toList();

        List<AuthorRecordResponseDTO> authorDtos = authorRecordMapper.toResponseDTOList(authorEntities);
        String merged = authorEntities.stream()
                .map(AuthorRecord::getDisplayName)
                .collect(Collectors.joining(", "));

        return new JournalListItemDTO(
                paper.getId(), paper.getSourceId(), paper.getPaperTitle(), paper.getJournalName(),
                paper.getJournalType(), paper.getImpactFactorClarivate(), paper.getImpactFactorJournal(),
                paper.getYearOfPublication(), paper.getMonthOfPublication(), paper.getIndexIn(),
                paper.getIssnNo(), paper.getVolumeNo(), paper.getIssueNo(), paper.getPageNo(),
                paper.getWebsiteJournalLink(), paper.getArticleLink(), paper.getDoiNumber(),
                paper.getInstituteName(), paper.getDeptCode(),
                authorDtos, merged, paper.getDownloadFileLink()
        );
    }

    private boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }
}