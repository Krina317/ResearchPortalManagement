package com.nirma.portal.portal_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nirma.portal.portal_backend.dto.ConferenceListItemDTO;
import com.nirma.portal.portal_backend.dto.ConferenceRequestDTO;
import com.nirma.portal.portal_backend.service.ConferenceCRUD;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/conference")
@RequiredArgsConstructor
public class ConferenceCrudController {

    private final ConferenceCRUD conferenceCRUD;

    @PostMapping
    public ResponseEntity<ConferenceListItemDTO> create(@Valid @RequestBody ConferenceRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(conferenceCRUD.create(request));
    }

    @PutMapping("/{id}")
    public ConferenceListItemDTO update(@PathVariable Long id, @Valid @RequestBody ConferenceRequestDTO request) {
        return conferenceCRUD.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        conferenceCRUD.delete(id);
        return ResponseEntity.noContent().build();
    }
}