package com.nirma.portal.portal_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.entity.AuthorRecord;
import com.nirma.portal.portal_backend.entity.JournalPaper;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.repository.AuthorRecordRepository;
import com.nirma.portal.portal_backend.repository.JournalPaperRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
@RequiredArgsConstructor
public class JournalRowPersister {

    private final JournalPaperRepository journalPaperRepository;
    private final AuthorRecordRepository authorRecordRepository;

    @Transactional
    public void saveRow(JournalPaper paper, List<String> authorNames) {
        journalPaperRepository.save(paper);
        
        log.trace("Entered saveRow() for journal paper '{}'",
                paper.getPaperTitle());
        
        log.debug("Saving journal paper '{}' with {} authors",
                paper.getPaperTitle(), authorNames.size());
        
        try {

	        int position = 1;
	        for (String name : authorNames) {
	            AuthorRecord author = new AuthorRecord();
	            author.setDisplayName(name);
	            author.setNormalizedName(normalizeName(name));
	            author.setPublicationId(paper.getId());
	            author.setPublicationType(PublicationType.JOURNAL);
	            author.setAuthorPosition(position++);
	            authorRecordRepository.save(author);
	        }
	        log.info("Successfully persisted journal paper '{}' with {} authors",
	                paper.getPaperTitle(), authorNames.size());
        }
        catch(Exception e) {
        	 log.error("Failed to persist journal paper '{}'",
                     paper.getPaperTitle(), e);

             throw e;
        }
        
    }

    private String normalizeName(String name) {
        return name.toUpperCase().replaceAll("\\s+", " ").trim();
    }
}