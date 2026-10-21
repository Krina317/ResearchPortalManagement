package com.nirma.portal.portal_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * What the browser receives for each faculty member.
 * Deliberately contains NO scholar id.
 *
 * status: "OK" | "NO_PUBLIC_PROFILE" | "ERROR"
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ScholarMetricsDTO {

    @JsonProperty("facultyId")
    private Long facultyId;

    @JsonProperty("name")
    private String name;

    @JsonProperty("status")
    private String status;

    @JsonProperty("citations")
    private Integer citations;

    // Lombok's getter is getHIndex(), which Jackson would turn into "hindex".
    // @JsonProperty forces the JSON name to be exactly "hIndex" (what the frontend reads).
    @JsonProperty("hIndex")
    private Integer hIndex;

    @JsonProperty("i10Index")
    private Integer i10Index;
}