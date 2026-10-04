package com.nirma.portal.portal_backend.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConferenceRequestDTO {

    @NotNull
    private Long sourceId;

    @NotBlank
    private String conferenceName;

    @NotBlank
    private String conferenceType;

    @NotBlank
    private String paperTitle;

    private LocalDate fromDate;
    private LocalDate toDate;

    @NotBlank
    private String instituteName;

    @NotBlank
    private String deptCode;

    /** Ordered author names; position = index + 1. May be empty, but not missing. */
    @NotNull
    private List<String> authors;
}