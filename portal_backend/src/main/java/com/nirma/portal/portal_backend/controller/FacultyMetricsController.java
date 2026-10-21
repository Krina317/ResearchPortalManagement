package com.nirma.portal.portal_backend.controller;

import com.nirma.portal.portal_backend.dto.ScholarMetricsDTO;
import com.nirma.portal.portal_backend.entity.FacultyList;
import com.nirma.portal.portal_backend.repository.FacultyListRepository;
import com.nirma.portal.portal_backend.service.ScholarScraperService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

@RestController
@RequestMapping("/api/faculty-metrics")
@CrossOrigin // remove if you already configure CORS globally
public class FacultyMetricsController {

    private static final long DELAY_MS = 3000;       // polite delay between Scholar requests
    private static final int RETRY_LOOKUP_DAYS = 7;  // how often to re-search a missing profile

    private final FacultyListRepository facultyRepo;
    private final ScholarScraperService scraper;

    // Prevents two scrapes running at once (e.g. double click).
    private final AtomicBoolean running = new AtomicBoolean(false);

    public FacultyMetricsController(FacultyListRepository facultyRepo,
                                    ScholarScraperService scraper) {
        this.facultyRepo = facultyRepo;
        this.scraper = scraper;
    }

    /**
     * Button endpoint. Fetches live citations / h-index / i10-index for every
     * faculty member who has a stored profile. Nothing else is saved.
     */
    
    @GetMapping("/faculty")
    public List<Map<String, Object>> getFaculty() {
        return facultyRepo.findAll().stream()
                .map(f -> Map.<String, Object>of(
                        "id", f.getId(),
                        "name", f.getName(),
                        "designation", f.getDesignation(),
                        "dept", f.getDept()))
                .toList();
    }
    
    @PostMapping("/scrape")
    public ResponseEntity<List<ScholarMetricsDTO>> scrape() {
        if (!running.compareAndSet(false, true)) {
            return ResponseEntity.status(409).build();   // already running
        }
        try {
            List<ScholarMetricsDTO> out = new ArrayList<>();

            for (FacultyList f : facultyRepo.findAll()) {
                if (f.getScholarId() == null) {
                    out.add(new ScholarMetricsDTO(f.getId(), f.getName(), "NO_PUBLIC_PROFILE", null, null, null));
                    continue;
                }
                try {
                    int[] m = scraper.fetchMetrics(f.getScholarId());
                    out.add(new ScholarMetricsDTO(f.getId(), f.getName(), "OK", m[0], m[1], m[2]));
                } catch (Exception e) {
                	 System.err.println("SCRAPE FAILED for " + f.getName() + ": " + e);
                	 out.add(new ScholarMetricsDTO(f.getId(), f.getName(), "ERROR", null, null, null));
                }
                if (!sleep(DELAY_MS)) break;
            }
            return ResponseEntity.ok(out);
        } finally {
            running.set(false);
        }
    }

    /**
     * Finds Scholar profiles (verified nirma email) for faculty who don't have one yet,
     * and remembers the id. Run this occasionally (e.g. when assistant professors make
     * their profiles public). Each missing person is re-searched at most once a week.
     */
    @PostMapping("/resolve-profiles")
    public ResponseEntity<Map<String, Integer>> resolveProfiles() {
        if (!running.compareAndSet(false, true)) {
            return ResponseEntity.status(409).build();
        }
        try {
            int checked = 0, found = 0, skipped = 0, errors = 0;
            LocalDateTime cutoff = LocalDateTime.now().minusDays(RETRY_LOOKUP_DAYS);

            for (FacultyList f : facultyRepo.findByScholarIdIsNull()) {
                if (f.getLastLookupAt() != null && f.getLastLookupAt().isAfter(cutoff)) {
                    skipped++;
                    continue;
                }
                checked++;
                try {
                    var id = scraper.findVerifiedNirmaId(f.getName());
                    id.ifPresent(f::setScholarId);
                    f.setLastLookupAt(LocalDateTime.now());
                    facultyRepo.save(f);
                    if (id.isPresent()) found++;
                } catch (Exception e) {
                    errors++;   // likely blocked; don't mark as looked up
                }
                if (!sleep(DELAY_MS)) break;
            }
            return ResponseEntity.ok(Map.of(
                    "checked", checked, "found", found, "skipped", skipped, "errors", errors));
        } finally {
            running.set(false);
        }
    }

    private boolean sleep(long ms) {
        try {
            Thread.sleep(ms);
            return true;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }
}