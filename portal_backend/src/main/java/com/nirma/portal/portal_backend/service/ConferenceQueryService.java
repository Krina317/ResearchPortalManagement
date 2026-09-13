package com.nirma.portal.portal_backend.service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.dto.AuthorRecordResponseDTO;
import com.nirma.portal.portal_backend.dto.ColumnMetaDTO;
import com.nirma.portal.portal_backend.dto.ConferenceFilterOptionsDTO;
import com.nirma.portal.portal_backend.dto.ConferenceListItemDTO;
import com.nirma.portal.portal_backend.dto.ConferenceSearchCriteria;
import com.nirma.portal.portal_backend.entity.AuthorRecord;
import com.nirma.portal.portal_backend.entity.ConferencePaper;
import com.nirma.portal.portal_backend.entity.DepartmentList;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.exception.ConferencePaperNotFoundException;
import com.nirma.portal.portal_backend.mapper.AuthorRecordMapper;
import com.nirma.portal.portal_backend.repository.AuthorRecordRepository;
import com.nirma.portal.portal_backend.repository.ConferencePaperRepository;
import com.nirma.portal.portal_backend.repository.DepartmentListRepository;
import com.nirma.portal.portal_backend.repository.ExcelColumnMapRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConferenceQueryService {

    private final ConferencePaperRepository conferencePaperRepository;
    private final AuthorRecordRepository authorRecordRepository;
    private final ExcelColumnMapRepository excelColumnMapRepository;
    private final AuthorRecordMapper authorRecordMapper;
    private final DepartmentListRepository departmentListRepository;

    @Transactional(readOnly = true)
    public Page<ConferenceListItemDTO> search(ConferenceSearchCriteria criteria, Pageable pageable) {

        List<Long> authorIds = null;
        boolean hasAuthorFilter = notBlank(criteria.getAuthorName())
                || (criteria.getAuthorPositions() != null && !criteria.getAuthorPositions().isEmpty());
        if (hasAuthorFilter) {
            boolean hasPositions = criteria.getAuthorPositions() != null && !criteria.getAuthorPositions().isEmpty();
            authorIds = authorRecordRepository.findMatchingPublicationIds(
                    PublicationType.CONFERENCE.name(),
                    blankToNull(criteria.getAuthorName()),
                    hasPositions,
                    hasPositions ? criteria.getAuthorPositions() : List.of()
            );
        }

        LocalDate fromDate = criteria.getFromDate();
        LocalDate toDate = criteria.getToDate();
        if (fromDate == null && toDate == null) {
            if (criteria.getAcademicYear() != null) {
                int y = criteria.getAcademicYear();
                fromDate = LocalDate.of(y, 7, 1);
                toDate = LocalDate.of(y + 1, 6, 30);
            } else if (criteria.getFinancialYear() != null) {
                int y = criteria.getFinancialYear();
                fromDate = LocalDate.of(y, 4, 1);
                toDate = LocalDate.of(y + 1, 3, 31);
            } else if (criteria.getCalendarYear() != null) {
                int y = criteria.getCalendarYear();
                fromDate = LocalDate.of(y, 1, 1);
                toDate = LocalDate.of(y, 12, 31);
            }
        }

        Page<ConferencePaper> page = conferencePaperRepository.search(
                criteria, fromDate, toDate, authorIds, pageable
        );

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

    @Transactional(readOnly = true)
    public long getTotalCount() {
        return conferencePaperRepository.count();
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

    private String blankToNull(String s) {
        return notBlank(s) ? s : null;
    }

    @Transactional(readOnly = true)
    public ConferenceFilterOptionsDTO getFilterOptions() {
        List<String> conferenceTypes = conferencePaperRepository.findAll()
                .stream()
                .map(ConferencePaper::getConferenceType)
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .toList();

        List<String> institutes = conferencePaperRepository.findAll()
                .stream()
                .map(ConferencePaper::getInstituteName)
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .toList();

        List<String> departments = departmentListRepository
                .findByPublicationTypeAndActiveTrue(PublicationType.CONFERENCE)
                .stream()
                .map(DepartmentList::getDeptCode)
                .toList();

        return new ConferenceFilterOptionsDTO(conferenceTypes, institutes, departments);
    }
}