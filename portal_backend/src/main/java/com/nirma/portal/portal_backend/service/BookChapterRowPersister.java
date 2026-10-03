package com.nirma.portal.portal_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.entity.AuthorMaster;
import com.nirma.portal.portal_backend.entity.BookChapter;
import com.nirma.portal.portal_backend.entity.PublicationAuthor;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.repository.AuthorMasterRepository;
import com.nirma.portal.portal_backend.repository.BookChapterRepository;
import com.nirma.portal.portal_backend.repository.PublicationAuthorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookChapterRowPersister {

    private final BookChapterRepository bookChapterRepository;
    private final AuthorMasterRepository authorMasterRepository;
    private final PublicationAuthorRepository publicationAuthorRepository;
    private final FacultyMatchService facultyMatchService;

    @Transactional
    public void saveRow(BookChapter bookChapter, List<String> authorNames) {
        bookChapterRepository.save(bookChapter);

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
            publicationAuthor.setPublicationId(bookChapter.getId());
            publicationAuthor.setPublicationType(PublicationType.BOOK_CHAPTER);
            publicationAuthor.setAuthorPosition(position++);

            publicationAuthorRepository.save(publicationAuthor);
        }
    }

    private String normalizeName(String name) {
        return name.toUpperCase()
                .replaceAll("\\s+", " ")
                .trim();
    }
}