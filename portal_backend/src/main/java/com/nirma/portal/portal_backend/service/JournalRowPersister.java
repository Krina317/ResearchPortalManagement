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

@Service
@RequiredArgsConstructor
public class JournalRowPersister {

    private final JournalPaperRepository journalPaperRepository;
    private final AuthorRecordRepository authorRecordRepository;

    @Transactional
    public void saveRow(JournalPaper paper, List<String> authorNames) {
        journalPaperRepository.save(paper);

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
    }

    private String normalizeName(String name) {
        return name.toUpperCase().replaceAll("\\s+", " ").trim();
    }
}