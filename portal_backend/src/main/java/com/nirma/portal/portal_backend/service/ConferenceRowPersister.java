package com.nirma.portal.portal_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.entity.ConferencePaper;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.repository.ConferencePaperRepository;
import com.nirma.portal.portal_backend.entity.AuthorMaster;
import com.nirma.portal.portal_backend.entity.PublicationAuthor;
import com.nirma.portal.portal_backend.repository.AuthorMasterRepository;
import com.nirma.portal.portal_backend.repository.PublicationAuthorRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
@RequiredArgsConstructor
public class ConferenceRowPersister {

    private final ConferencePaperRepository conferencePaperRepository;
    private final AuthorMasterRepository authorMasterRepository;
    private final PublicationAuthorRepository publicationAuthorRepository;
    private final FacultyMatchService facultyMatchService;

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

    		    String normalizedName = normalizeName(name);

    		    Optional<AuthorMaster> existingAuthor =
    		            authorMasterRepository.findByNormalizedName(normalizedName);

    		    AuthorMaster author;

    		    if (existingAuthor.isPresent()) {
    		        author = existingAuthor.get();
    		    } else {
    		        author = new AuthorMaster();
    		        author.setDisplayName(name);
    		        author.setNormalizedName(normalizedName);

    		        facultyMatchService.applyTo(author, name);

    		        author = authorMasterRepository.save(author);
    		    }

    		    PublicationAuthor publicationAuthor = new PublicationAuthor();
    		    publicationAuthor.setAuthor(author);
    		    publicationAuthor.setPublicationId(paper.getId());
    		    publicationAuthor.setPublicationType(PublicationType.CONFERENCE);
    		    publicationAuthor.setAuthorPosition(position++);

    		    publicationAuthorRepository.save(publicationAuthor);
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