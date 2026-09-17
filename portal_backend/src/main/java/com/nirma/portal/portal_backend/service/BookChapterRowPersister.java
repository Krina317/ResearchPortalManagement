package com.nirma.portal.portal_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.entity.AuthorRecord;
import com.nirma.portal.portal_backend.entity.BookChapter;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.repository.AuthorRecordRepository;
import com.nirma.portal.portal_backend.repository.BookChapterRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookChapterRowPersister {

    private final BookChapterRepository bookChapterRepository;
    private final AuthorRecordRepository authorRecordRepository;

    @Transactional
    public void saveRow(BookChapter bookChapter, List<String> authorNames) {
        bookChapterRepository.save(bookChapter);

        int position = 1;

        for (String name : authorNames) {
            AuthorRecord author = new AuthorRecord();

            author.setDisplayName(name);
            author.setNormalizedName(normalizeName(name));
            author.setPublicationId(bookChapter.getId());
            author.setPublicationType(PublicationType.BOOK_CHAPTER);
            author.setAuthorPosition(position++);

            authorRecordRepository.save(author);
        }
    }

    private String normalizeName(String name) {
        return name.toUpperCase()
                .replaceAll("\\s+", " ")
                .trim();
    }
}