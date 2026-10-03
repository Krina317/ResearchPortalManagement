package com.nirma.portal.portal_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nirma.portal.portal_backend.service.ConferenceQueryService;
import com.nirma.portal.portal_backend.service.JournalQueryService;
import com.nirma.portal.portal_backend.service.ProjectService;
import com.nirma.portal.portal_backend.service.BookChapterQueryService;



import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ConferenceQueryService conferenceQueryService;
    private final JournalQueryService journalQueryService;
    private final ProjectService nuFundedProjectService;
    private final ProjectService extFundedProjectService;
    private final BookChapterQueryService bookChapterQueryService;

    @GetMapping("/count/conference")
    public long getTotalConferencePapers() {

        log.trace("Entered getTotalConferencePapers()");

        long count = conferenceQueryService.getTotalCount();

        log.debug("Total conference papers: {}", count);

        return count;
    }

    @GetMapping("/count/journal")
    public long getTotalJournalPaper() {

        log.trace("Entered getTotalJournalPaper()");

        long count = journalQueryService.getTotalCount();

        log.debug("Total journal papers: {}", count);

        return count;
    }

    @GetMapping("/count/nu-funded-projects")
    public long getTotalNuFundedProjects() {

        log.trace("Entered getTotalNuFundedProjects()");

        long count = nuFundedProjectService.getAllNuProjects().size();

        log.debug("Total NU funded projects: {}", count);

        return count;
    }

	@GetMapping("/count/ext-funded-projects")
	public long getTotalExtFundedProjects() {
	
	    log.trace("Entered getTotalExtFundedProjects()");
	
	    long count = extFundedProjectService.getAllExternalProjects().size();
	
	    log.debug("Total external funded projects: {}", count);
	
	    return count;
	}
	
	@GetMapping("/count/book-chapters")
	public long getTotalBookChapters() {

	    log.trace("Entered getTotalBookChapters()");

	    long count = bookChapterQueryService.getTotalCount();

	    log.debug("Total book chapters: {}", count);

	    return count;
	}
}