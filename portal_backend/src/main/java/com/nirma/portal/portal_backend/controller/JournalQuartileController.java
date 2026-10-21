package com.nirma.portal.portal_backend.controller;

import org.springframework.web.bind.annotation.*;

import com.nirma.portal.portal_backend.dto.JournalListItemDTO;
import com.nirma.portal.portal_backend.dto.QuartileRequestDTO;
import com.nirma.portal.portal_backend.service.JournalCRUD;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
public class JournalQuartileController {

    private final JournalCRUD journalCRUD;

    @PutMapping("/{id}/quartile")
    public JournalListItemDTO setQuartile(@PathVariable Long id, @RequestBody QuartileRequestDTO request) {
        return journalCRUD.setQuartile(id, request.getQuartile());
    }
}