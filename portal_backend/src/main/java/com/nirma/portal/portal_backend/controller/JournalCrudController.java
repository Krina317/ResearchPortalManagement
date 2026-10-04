package com.nirma.portal.portal_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nirma.portal.portal_backend.dto.JournalListItemDTO;
import com.nirma.portal.portal_backend.dto.JournalRequestDTO;
import com.nirma.portal.portal_backend.service.JournalCRUD;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
public class JournalCrudController {

    private final JournalCRUD journalCRUD;

    @PostMapping
    public ResponseEntity<JournalListItemDTO> create(@Valid @RequestBody JournalRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(journalCRUD.create(request));
    }

    @PutMapping("/{id}")
    public JournalListItemDTO update(@PathVariable Long id, @Valid @RequestBody JournalRequestDTO request) {
        return journalCRUD.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        journalCRUD.delete(id);
        return ResponseEntity.noContent().build();
    }
}