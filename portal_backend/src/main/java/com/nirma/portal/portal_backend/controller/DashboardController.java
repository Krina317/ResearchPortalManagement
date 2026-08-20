package com.nirma.portal.portal_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nirma.portal.portal_backend.service.ConferenceQueryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final ConferenceQueryService conferenceQueryService;
    @GetMapping("/count")
    public long getTotalConferencePapers(){
        return conferenceQueryService.getTotalCount();
    }
}