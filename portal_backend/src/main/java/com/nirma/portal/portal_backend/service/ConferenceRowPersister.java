package com.nirma.portal.portal_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.entity.AuthorRecord;
import com.nirma.portal.portal_backend.entity.ConferencePaper;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.repository.AuthorRecordRepository;
import com.nirma.portal.portal_backend.repository.ConferencePaperRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
@RequiredArgsConstructor
public class ConferenceRowPersister {

    private final ConferencePaperRepository conferencePaperRepository;
    private final AuthorRecordRepository authorRecordRepository;

    @Transactional
    public void saveRow(ConferencePaper paper, List<String> authorNames) {
    	log.trace("Entered saveRow() for conference paper '{}'",
    	            paper.getPaperTitle());

    	log.debug("Saving conference paper '{}' with {} authors",
    	            paper.getPaperTitle(), authorNames.size());
    	
    	try {
    		conferencePaperRepository.save(paper);

    		int position = 1;
    		for (String name : authorNames) {
    			AuthorRecord author = new AuthorRecord();
    			author.setDisplayName(name);
    			author.setNormalizedName(normalizeName(name));
    			author.setPublicationId(paper.getId());
    			author.setPublicationType(PublicationType.CONFERENCE);
    			author.setAuthorPosition(position++);
    			authorRecordRepository.save(author);
    		}
    		 log.info("Successfully persisted conference paper '{}' with {} authors",
    	                paper.getPaperTitle(), authorNames.size());
    	} catch(Exception e) {
    		log.error("Failed to persist conference paper '{}'",
                    paper.getPaperTitle(), e);
    		throw e;
    	}
    }

    private String normalizeName(String name) {
        return name.toUpperCase().replaceAll("\\s+", " ").trim();
    }
}