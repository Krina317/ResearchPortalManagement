package com.nirma.portal.portal_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentTypeRequestDTO {

    /** "UG", "PG", "PHD", or null/blank to clear the level. */
    private String studentType;
}