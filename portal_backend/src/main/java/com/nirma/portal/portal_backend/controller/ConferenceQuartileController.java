package com.nirma.portal.portal_backend.controller;

import org.springframework.web.bind.annotation.*;

import com.nirma.portal.portal_backend.dto.ConferenceListItemDTO;
import com.nirma.portal.portal_backend.dto.QuartileRequestDTO;
import com.nirma.portal.portal_backend.service.ConferenceCRUD;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/conference")
@RequiredArgsConstructor
public class ConferenceQuartileController {

    private final ConferenceCRUD conferenceCRUD;

    @PutMapping("/{id}/quartile")
    public ConferenceListItemDTO setQuartile(@PathVariable Long id, @RequestBody QuartileRequestDTO request) {
        return conferenceCRUD.setQuartile(id, request.getQuartile());
    }
}