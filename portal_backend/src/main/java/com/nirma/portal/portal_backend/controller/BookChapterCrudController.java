package com.nirma.portal.portal_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nirma.portal.portal_backend.dto.BookChapterListItemDTO;
import com.nirma.portal.portal_backend.dto.BookChapterRequestDTO;
import com.nirma.portal.portal_backend.service.BookChapterCRUD;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/book-chapters")
@RequiredArgsConstructor
public class BookChapterCrudController {

    private final BookChapterCRUD bookChapterCRUD;

    @PostMapping
    public ResponseEntity<BookChapterListItemDTO> create(@Valid @RequestBody BookChapterRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookChapterCRUD.create(request));
    }

    @PutMapping("/{id}")
    public BookChapterListItemDTO update(@PathVariable Long id, @Valid @RequestBody BookChapterRequestDTO request) {
        return bookChapterCRUD.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookChapterCRUD.delete(id);
        return ResponseEntity.noContent().build();
    }
}